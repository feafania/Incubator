import { BlogQueryRepository } from "../repositories/blog.query.repository";
import { BlogListRequestPayload } from "../routes/request-payloads/blog-list-request.payload";
import { BlogListPaginatedOutput } from "./output/blog-list-paginated.output";
import BlogOutput from "./output/blog.output";

class BlogsQueryService {
  private blogQueryRepository: BlogQueryRepository;
  constructor() {
    this.blogQueryRepository = new BlogQueryRepository();
  }
  async findMany(
    queryDto: BlogListRequestPayload,
  ): Promise<BlogListPaginatedOutput> {
    return this.blogQueryRepository.findMany(queryDto);
  }

  async findByIdOrFail(id: string): Promise<BlogOutput> {
    return this.blogQueryRepository.findByIdOrFail(id);
  }
}

export const blogQueryService = new BlogsQueryService();
