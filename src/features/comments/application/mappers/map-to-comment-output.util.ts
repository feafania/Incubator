import { WithId } from "mongodb";
import { CommentOutput } from "../output/comment.output";
import { CommentEntity } from "../../domain/comment";

export function mapToCommentOutput(
  userComment: WithId<CommentEntity>,
): CommentOutput {
  return {
    id: userComment._id.toString(),
    content: userComment.content,
    commentatorInfo: userComment.commentatorInfo,
    createdAt: userComment.createdAt,
  };
}
