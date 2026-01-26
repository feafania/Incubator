import { LikeInfoDomainDto } from "./like-info-domain.dto";
import { NewestLikeDomainDto } from "./newest-like-domain.dto";

export type ExtendedLikeInfoDomainDto = LikeInfoDomainDto & {
  newestLikes: NewestLikeDomainDto[];
};
