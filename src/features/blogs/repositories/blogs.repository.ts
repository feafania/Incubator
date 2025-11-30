import { ObjectId, WithId } from "mongodb";
import { Blog } from "../domain/blogs";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { blogCollection } from "../../../db/mongo.db";
import { injectable } from "inversify";

@injectable()
export class BlogsRepository {
  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Blog not exist");
    }
    const res = await blogCollection.findOne({ _id: objectId });

    if (!res) {
      throw new RepositoryNotFoundError("Blog not exist");
    }

    return Blog.reconstitute(res);
  }

  async findIndex(id: string): Promise<ObjectId | null> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Blog not exist");
    }
    if (objectId) {
      const res = await blogCollection.findOne({ _id: objectId });
      if (res) {
        return res._id;
      }
    }
    return null;
  }

  async deleteMany(): Promise<void> {
    await blogCollection.deleteMany({});
  }

  async delete(id: string): Promise<void> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Blog not exist");
    }

    const deleteResult = await blogCollection.deleteOne({
      _id: objectId,
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No blog for delete");
      throw new RepositoryNotFoundError("Blog not exist");
    }

    return;
  }

  async save(blog: Blog): Promise<Blog> {
    if (!blog._id) {
      const insertResult = await blogCollection.insertOne(blog);

      blog._id = insertResult.insertedId;

      return blog;
    } else {
      const { _id, ...dtoToUpdate } = blog;

      const updateResult = await blogCollection.updateOne(
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
        throw new RepositoryNotFoundError("Blog not exist");
      }

      return blog;
    }
  }
}
