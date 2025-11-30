import { BlogQueryRepository } from "../repositories/blog.query.repository";
import { BlogListRequestPayload } from "../routes/request-payloads/blog-list-request.payload";
import { BlogListPaginatedOutput } from "./output/blog-list-paginated.output";
import BlogOutput from "./output/blog.output";
import { inject, injectable } from "inversify";

@injectable()
export class BlogQueryService {
  constructor(
    @inject(BlogQueryRepository)
    private blogQueryRepository: BlogQueryRepository,
  ) {}
  async findMany(
    queryDto: BlogListRequestPayload,
  ): Promise<BlogListPaginatedOutput> {
    return this.blogQueryRepository.findMany(queryDto);
  }

  async findByIdOrFail(id: string): Promise<BlogOutput> {
    return this.blogQueryRepository.findByIdOrFail(id);
  }
}
