import { UserListPaginatedOutput } from "../application/output/user-list-paginated.output";
import { UserListRequestPayload } from "../routes/request-payloads/user-list-request.payload";
import { UserOutput } from "../application/output/user.output";
import { mapToUserOutput } from "../application/mappers/map-to-user-output.util";
import { mapToUserListPaginatedOutput } from "../application/mappers/map-to-user-list-paginated-output.util";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import mongoose from "mongoose";
import { UserModel } from "../domain/user";
import { mapToMongoSortDirection } from "../../../core/helpers/map-to-mongo-sort-direction.util";

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
      UserModel.find(filter)
        .sort({ [sortBy]: mapToMongoSortDirection(sortDirection) })
        .skip(skip)
        .limit(pageSize),
      UserModel.countDocuments(filter),
    ]);

    return mapToUserListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async findByIdOrFail(id: string): Promise<UserOutput> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("User not exist");
    }
    const user = await UserModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!user) {
      throw new RepositoryNotFoundError("User not exist");
    }
    return mapToUserOutput(user);
  }
}
