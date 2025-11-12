import { User } from "../domain/user";
import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../../db/mongo.db";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";

export class UsersRepository {
  async findByIdOrFail(id: string): Promise<WithId<User>> {
    const res = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError("User not exist");
    }

    return User.reconstitute(res);
  }

  async findByLogin(login: string) {
    return await userCollection.findOne({ login });
  }

  async findByEmail(email: string) {
    return await userCollection.findOne({ email });
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
