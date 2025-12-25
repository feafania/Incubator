import { LikeStatus } from "../../domain/like-status-type";

export type LikesInfoOutput = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};
