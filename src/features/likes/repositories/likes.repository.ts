import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import mongoose from "mongoose";
import { LikeDocument, LikeModel } from "../domain/like";

@injectable()
export class LikesRepository {
  async findByIdOrFail(id: string): Promise<LikeDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Like not exist");
    }

    const res = await LikeModel.findById(id);

    if (!res) {
      throw new RepositoryNotFoundError("Like not exist");
    }

    return res;
  }

  async findByAuthorAndParent(
    authorId: string,
    parentId: string,
  ): Promise<LikeDocument | null> {
    if (!authorId) return null;
    if (!parentId) return null;

    return await LikeModel.findOne()
      .where({ authorId })
      .where({ parentId })
      .exec();
  }

  async save(like: LikeDocument): Promise<LikeDocument> {
    return like.save();
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Like not exist");
    }

    const deleteResult = await LikeModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No like for delete");
      throw new RepositoryNotFoundError("Like not exist");
    }

    return;
  }

  async deleteMany(idForDelete: string[] = []): Promise<void> {
    const filter: Record<string, unknown> = {};
    if (idForDelete.length > 0) {
      filter._id = { $in: idForDelete };
    }
    await LikeModel.deleteMany(filter);
  }
}
