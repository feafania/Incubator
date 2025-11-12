import { CommentatorDomainDto } from "./commentator-domain.dto";

export type CommentDomainDto = {
  content: string;
  postId: string;
  commentatorInfo: CommentatorDomainDto;
};
