import { ExtendedLikeInfoDomainDto } from "../../likes/domain/extended-like-info-domain.dto";

export type PostDomainDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  extendedLikesInfo?: ExtendedLikeInfoDomainDto;
};
