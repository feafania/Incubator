import { CommentOutput } from "../output/comment.output";
import { LikeStatus } from "../../../likes/domain/like-status-type";
import { CommentWithStatus } from "../../domain/comment";

export function mapToCommentOutput(
  userComment: CommentWithStatus,
): CommentOutput {
  return {
    id: userComment._id.toString(),
    content: userComment.content,
    commentatorInfo: userComment.commentatorInfo,
    createdAt: userComment.createdAt,
    likesInfo: {
      likesCount: userComment.likesInfo.likesCount ?? 0,
      dislikesCount: userComment.likesInfo.dislikesCount ?? 0,
      myStatus: userComment.likesInfo.myStatus ?? LikeStatus.NONE,
    },
  };
}
