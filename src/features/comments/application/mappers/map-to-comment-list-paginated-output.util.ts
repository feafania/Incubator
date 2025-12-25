import { CommentListPaginatedOutput } from "../output/comment-list-paginated.output";
import { CommentOutput } from "../output/comment.output";
import { CommentWithStatus } from "../../domain/comment";
import { mapToCommentOutput } from "./map-to-comment-output.util";

export function mapToCommentListPaginatedOutput(
  comments: CommentWithStatus[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): CommentListPaginatedOutput {
  return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: comments.map(
      (userComment): CommentOutput => mapToCommentOutput(userComment),
    ),
  };
}
