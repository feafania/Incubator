import { CommentOutput } from "../output/comment.output";
import { CommentDocument } from "../../domain/comment";

export function mapToCommentOutput(
  userComment: CommentDocument,
): CommentOutput {
  return {
    id: userComment._id.toString(),
    content: userComment.content,
    commentatorInfo: userComment.commentatorInfo,
    createdAt: userComment.createdAt,
  };
}
