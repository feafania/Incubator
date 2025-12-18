import { UserDocument, UserModel } from "../domain/user";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class UsersRepository {
  async findByIdOrFail(id: string): Promise<UserDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("User not exist");
    }
    const res = await UserModel.findById(id);

    if (!res) {
      throw new RepositoryNotFoundError("User not exist");
    }

    return res;
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    const res = await UserModel.findOne({ login });
    return res ? res : null;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const res = await UserModel.findOne({ email });
    return res ? res : null;
  }

  async save(user: UserDocument): Promise<UserDocument> {
    console.log(user);
    return user.save();
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("User not exist");
    }

    const deleteResult = await UserModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError("User not exist");
    }

    return;
  }

  async deleteMany(): Promise<void> {
    await UserModel.deleteMany({});
  }
}
