import { LikeStatus } from "./like-status-type";

export type LikeDomainDto = {
  status: LikeStatus;
  authorId: string;
  parentId: string;
};
