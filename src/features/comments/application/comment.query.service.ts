import { CommentQueryRepository } from "../repositories/comment.query.repository";
import { CommentListRequestPayload } from "../routes/request-payloads/comment-list-request.payload";
import { CommentListPaginatedOutput } from "./output/comment-list-paginated.output";
import { CommentOutput } from "./output/comment.output";
import { inject, injectable } from "inversify";

@injectable()
export class CommentQueryService {
  constructor(
    @inject(CommentQueryRepository)
    private commentQueryRepository: CommentQueryRepository,
  ) {}
  async findMany(
    queryDto: CommentListRequestPayload,
  ): Promise<CommentListPaginatedOutput> {
    return this.commentQueryRepository.findMany(queryDto);
  }

  async findCommentsByPost(
    queryDto: CommentListRequestPayload,
    postId: string,
  ): Promise<CommentListPaginatedOutput> {
    return this.commentQueryRepository.findCommentsByPost(queryDto, postId);
  }

  async findByIdOrFail(id: string): Promise<CommentOutput> {
    return this.commentQueryRepository.findByIdOrFail(id);
  }
}
