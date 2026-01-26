import { PostQueryRepository } from "../repositories/post.query.repository";
import { PostListRequestPayload } from "../routes/request-payloads/post-list-request.payload";
import { PostListPaginatedOutput } from "./output/post-list-paginated.output";
import PostOutput from "./output/post.output";
import { inject, injectable } from "inversify";

@injectable()
export class PostQueryService {
  constructor(
    @inject(PostQueryRepository)
    private postQueryRepository: PostQueryRepository,
  ) {}
  async findMany(
    queryDto: PostListRequestPayload,
    blogId?: string,
    userId?: string,
  ): Promise<PostListPaginatedOutput> {
    return this.postQueryRepository.findMany(queryDto, blogId, userId);
  }

  async findByIdOrFail(id: string, userId?: string): Promise<PostOutput> {
    return this.postQueryRepository.findByIdOrFail(id, userId);
  }
}
