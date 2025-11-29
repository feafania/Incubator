import { PostDomainDto } from "../../domain/post-domain.dto";

export type CreatePostCommand = PostDomainDto;
export type UpdatePostCommand = PostDomainDto & { id: string };
