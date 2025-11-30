import { Post } from "../domain/posts";
import { postCollection } from "../../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { injectable } from "inversify";

@injectable()
export class PostsRepository {
  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Post not exist");
    }
    const res = await postCollection.findOne({ _id: objectId });

    if (!res) {
      throw new RepositoryNotFoundError("Post not exist");
    }

    return Post.reconstitute(res);
  }

  async findIndex(id: string): Promise<ObjectId | null> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Post not exist");
    }
    if (objectId) {
      const res = await postCollection.findOne({ _id: objectId });
      if (res) {
        return res._id;
      }
    }
    return null;
  }

  async deleteMany(): Promise<void> {
    await postCollection.deleteMany({});
  }

  async delete(id: string): Promise<void> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Post not exist");
    }

    const deleteResult = await postCollection.deleteOne({
      _id: objectId,
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No post for delete");
      throw new RepositoryNotFoundError("Post not exist");
    }

    return;
  }

  async save(post: Post): Promise<Post> {
    if (!post._id) {
      const insertResult = await postCollection.insertOne(post);

      post._id = insertResult.insertedId;

      return post;
    } else {
      const { _id, ...dtoToUpdate } = post;

      const updateResult = await postCollection.updateOne(
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
        throw new RepositoryNotFoundError("Post not exist");
      }

      return post;
    }
  }
}
