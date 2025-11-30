import { UserListPaginatedOutput } from "../application/output/user-list-paginated.output";
import { ObjectId } from "mongodb";
import { UserListRequestPayload } from "../routes/request-payloads/user-list-request.payload";
import { UserOutput } from "../application/output/user.output";
import { mapToUserOutput } from "../application/mappers/map-to-user-output.util";
import { mapToUserListPaginatedOutput } from "../application/mappers/map-to-user-list-paginated-output.util";
import { userCollection } from "../../../db/mongo.db";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { injectable } from "inversify";

@injectable()
export class UserQueryRepository {
  async findMany(
    queryDto: UserListRequestPayload,
  ): Promise<UserListPaginatedOutput> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const orConditions = [];

    if (searchLoginTerm) {
      orConditions.push({ login: { $regex: searchLoginTerm, $options: "i" } });
    }

    if (searchEmailTerm) {
      orConditions.push({ email: { $regex: searchEmailTerm, $options: "i" } });
    }

    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }

    const [items, totalCount] = await Promise.all([
      userCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      userCollection.countDocuments(filter),
    ]);

    return mapToUserListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async findByIdOrFail(id: string): Promise<UserOutput> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("User not exist");
    }
    const user = await userCollection.findOne({ _id: objectId });

    if (!user) {
      throw new RepositoryNotFoundError("User not exist");
    }
    return mapToUserOutput(user);
  }
}
