import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { CommentDocument, CommentModel } from "../domain/comment";
import { injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class CommentsRepository {
  async findByIdOrFail(id: string): Promise<CommentDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Blog not exist");
    }

    const res = await CommentModel.findById(id);

    if (!res) {
      throw new RepositoryNotFoundError("Comment not exist");
    }

    return res;
  }

  async save(comment: CommentDocument): Promise<CommentDocument> {
    return comment.save();
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Comment not exist");
    }

    const deleteResult = await CommentModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No comment for delete");
      throw new RepositoryNotFoundError("Comment not exist");
    }

    return;
  }

  async deleteMany(): Promise<void> {
    await CommentModel.deleteMany({});
  }

  async deleteByPostId(postId: string): Promise<string[]> {
    const comments = await CommentModel.find({ postId }, { _id: 1 }).lean();

    const ids = comments.map((c) => c._id.toString());

    if (ids.length === 0) {
      return [];
    }

    await CommentModel.deleteMany({ _id: { $in: ids } });

    return ids;
  }
}
