import { WithId } from "mongodb";
import { CommentListPaginatedOutput } from "../output/comment-list-paginated.output";
import { CommentOutput } from "../output/comment.output";
import { CommentEntity } from "../../domain/comment";

export function mapToCommentListPaginatedOutput(
  comments: WithId<CommentEntity>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): CommentListPaginatedOutput {
  return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: comments.map(
      (userComment): CommentOutput => ({
        id: userComment._id.toString(),
        content: userComment.content,
        commentatorInfo: userComment.commentatorInfo,
        createdAt: userComment.createdAt,
      }),
    ),
  };
}
