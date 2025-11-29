import { BlogDomainDto } from "../../domain/blog-domain.dto";

export type CreateBlogCommand = BlogDomainDto;
export type UpdateBlogCommand = BlogDomainDto & { id: string };
