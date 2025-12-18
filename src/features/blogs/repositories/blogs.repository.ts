import { BlogDocument, BlogModel } from "../domain/blogs";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class BlogsRepository {
  async findByIdOrFail(id: string): Promise<BlogDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Blog not exist");
    }
    const res = await BlogModel.findById(id);

    if (!res) {
      throw new RepositoryNotFoundError("Blog not exist");
    }

    return res;
  }

  async findIndex(id: string): Promise<mongoose.Types.ObjectId | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Blog not exist");
    }
    if (id) {
      const res = await BlogModel.findById(id);
      if (res) {
        return res._id;
      }
    }
    return null;
  }

  async deleteMany(): Promise<void> {
    await BlogModel.deleteMany({});
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Blog not exist");
    }

    const deleteResult = await BlogModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No blog for delete");
      throw new RepositoryNotFoundError("Blog not exist");
    }

    return;
  }

  async save(blog: BlogDocument): Promise<BlogDocument> {
    return blog.save();
  }
}
