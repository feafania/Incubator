import { CommentatorDomainDto } from "./commentator-domain.dto";
import { LikeInfoDomainDto } from "../../likes/domain/like-info-domain.dto";

export type CommentDomainDto = {
  content: string;
  postId: string;
  commentatorInfo: CommentatorDomainDto;
  likesInfo?: LikeInfoDomainDto;
};
