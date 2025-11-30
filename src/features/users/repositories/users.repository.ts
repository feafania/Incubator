import { User } from "../domain/user";
import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../../db/mongo.db";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { injectable } from "inversify";

@injectable()
export class UsersRepository {
  async findByIdOrFail(id: string): Promise<WithId<User>> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("User not exist");
    }
    const res = await userCollection.findOne({ _id: objectId });

    if (!res) {
      throw new RepositoryNotFoundError("User not exist");
    }

    return User.reconstitute(res);
  }

  async findByLogin(login: string): Promise<WithId<User> | null> {
    const res = await userCollection.findOne({ login });
    return res ? User.reconstitute(res) : null;
  }

  async findByEmail(email: string): Promise<WithId<User> | null> {
    const res = await userCollection.findOne({ email });
    return res ? User.reconstitute(res) : null;
  }

  async save(user: User): Promise<User> {
    if (!user._id) {
      const insertResult = await userCollection.insertOne(user);

      user._id = insertResult.insertedId;

      return user;
    } else {
      const { _id, ...dtoToUpdate } = user;

      const updateResult = await userCollection.updateOne(
        {
          _id,
        },
        {
          $set: {
            ...dtoToUpdate,
          },
        },
      );

      if (updateResult.matchedCount < 1) {
        throw new RepositoryNotFoundError("User not exist");
      }

      return user;
    }
  }

  async delete(id: string): Promise<void> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("User not exist");
    }

    const deleteResult = await userCollection.deleteOne({
      _id: objectId,
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No user for delete");
      throw new RepositoryNotFoundError("User not exist");
    }

    return;
  }

  async deleteMany(): Promise<void> {
    await userCollection.deleteMany({});
  }
}
