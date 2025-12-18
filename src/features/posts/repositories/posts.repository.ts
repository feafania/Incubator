import { PostDocument, PostModel } from "../domain/posts";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class PostsRepository {
  async findByIdOrFail(id: string): Promise<PostDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Post not exist");
    }
    const res = await PostModel.findById(id);

    if (!res) {
      throw new RepositoryNotFoundError("Post not exist");
    }

    return res;
  }

  async findIndex(id: string): Promise<mongoose.Types.ObjectId | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Post not exist");
    }
    if (id) {
      const res = await PostModel.findById(id);
      if (res) {
        return res._id;
      }
    }
    return null;
  }

  async deleteMany(): Promise<void> {
    await PostModel.deleteMany({});
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Post not exist");
    }

    const deleteResult = await PostModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No post for delete");
      throw new RepositoryNotFoundError("Post not exist");
    }

    return;
  }

  async save(post: PostDocument): Promise<PostDocument> {
    return post.save();
  }
}
