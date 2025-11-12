import { CommentDomainDto } from "../../domain/comment-domain.dto";
import { UpdateCommentDomainDto } from "../../domain/update-comment-domain.dto";

export type CreateCommentCommand = CommentDomainDto;
export type UpdateCommentCommand = UpdateCommentDomainDto & { id: string };
