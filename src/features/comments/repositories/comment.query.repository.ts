import { CommentListPaginatedOutput } from "../application/output/comment-list-paginated.output";
import { CommentListRequestPayload } from "../routes/request-payloads/comment-list-request.payload";
import { CommentOutput } from "../application/output/comment.output";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { mapToCommentListPaginatedOutput } from "../application/mappers/map-to-comment-list-paginated-output.util";
import { mapToCommentOutput } from "../application/mappers/map-to-comment-output.util";
import { injectable } from "inversify";
import mongoose from "mongoose";
import { CommentModel } from "../domain/comment";
import { mapToMongoSortDirection } from "../../../core/helpers/map-to-mongo-sort-direction.util";

@injectable()
export class CommentQueryRepository {
  async findMany(
    queryDto: CommentListRequestPayload,
  ): Promise<CommentListPaginatedOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const [items, totalCount] = await Promise.all([
      CommentModel.find(filter)
        .sort({ [sortBy]: mapToMongoSortDirection(sortDirection) })
        .skip(skip)
        .limit(pageSize)
        .exec(),
      CommentModel.countDocuments(filter),
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
      CommentModel.find(filter)
        .sort({ [sortBy]: mapToMongoSortDirection(sortDirection) })
        .skip(skip)
        .limit(pageSize)
        .exec(),
      CommentModel.countDocuments(filter),
    ]);
    return mapToCommentListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async findByIdOrFail(id: string): Promise<CommentOutput> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Comment not exist");
    }

    const userComment = await CommentModel.findById(id);

    if (!userComment) {
      throw new RepositoryNotFoundError("Comment not exist");
    }
    return mapToCommentOutput(userComment);
  }
}
