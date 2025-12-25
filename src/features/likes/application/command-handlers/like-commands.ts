import { LikeDomainDto } from "../../domain/like-domain.dto";
import { UpdateLikeDomainDto } from "../../domain/update-like-domain.dto";

export type CreateLikeCommand = LikeDomainDto;
export type UpdateLikeCommand = UpdateLikeDomainDto & {
  id: string;
};
export type SetLikeCommand = UpdateLikeDomainDto & {
  commentId: string;
  userId: string;
};
