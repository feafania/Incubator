import { CommentListPaginatedOutput } from "../application/output/comment-list-paginated.output";
import { ObjectId } from "mongodb";
import { CommentListRequestPayload } from "../routes/request-payloads/comment-list-request.payload";
import { CommentOutput } from "../application/output/comment.output";
import { commentCollection } from "../../../db/mongo.db";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { mapToCommentListPaginatedOutput } from "../application/mappers/map-to-comment-list-paginated-output.util";
import { mapToCommentOutput } from "../application/mappers/map-to-comment-output.util";

export class CommentQueryRepository {
  async findMany(
    queryDto: CommentListRequestPayload,
  ): Promise<CommentListPaginatedOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const [items, totalCount] = await Promise.all([
      commentCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      commentCollection.countDocuments(filter),
    ]);

    return mapToCommentListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async findCommentsByPost(
    queryDto: CommentListRequestPayload,
    postId: string,
  ): Promise<CommentListPaginatedOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const filter = { postId };
    const skip = (pageNumber - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      commentCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      commentCollection.countDocuments(filter),
    ]);
    return mapToCommentListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async findByIdOrFail(id: string): Promise<CommentOutput> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Comment not exist");
    }
    const userComment = await commentCollection.findOne({ _id: objectId });

    if (!userComment) {
      throw new RepositoryNotFoundError("Comment not exist");
    }
    return mapToCommentOutput(userComment);
  }
}
