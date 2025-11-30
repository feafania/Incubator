import { ObjectId, WithId } from "mongodb";
import { commentCollection } from "../../../db/mongo.db";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { CommentEntity } from "../domain/comment";
import { injectable } from "inversify";

@injectable()
export class CommentsRepository {
  async findByIdOrFail(id: string): Promise<WithId<CommentEntity>> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Comment not exist");
    }

    const res = await commentCollection.findOne({ _id: objectId });

    if (!res) {
      throw new RepositoryNotFoundError("Comment not exist");
    }

    return CommentEntity.reconstitute(res);
  }

  async save(comment: CommentEntity): Promise<CommentEntity> {
    if (!comment._id) {
      const insertResult = await commentCollection.insertOne(comment);

      comment._id = insertResult.insertedId;

      return comment;
    } else {
      const { _id, ...dtoToUpdate } = comment;

      const updateResult = await commentCollection.updateOne(
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
        throw new RepositoryNotFoundError("Comment not exist");
      }

      return comment;
    }
  }

  async delete(id: string): Promise<void> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Comment not exist");
    }

    const deleteResult = await commentCollection.deleteOne({
      _id: objectId,
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No comment for delete");
      throw new RepositoryNotFoundError("Comment not exist");
    }

    return;
  }

  async deleteMany(): Promise<void> {
    await commentCollection.deleteMany({});
  }
}
