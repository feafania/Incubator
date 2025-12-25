import { LikeInfoDomainDto } from "../../likes/domain/like-info-domain.dto";

export type UpdateCommentDomainDto = {
  content: string;
  likesInfo?: LikeInfoDomainDto;
};
