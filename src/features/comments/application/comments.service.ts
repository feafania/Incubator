import { CommentsRepository } from "../repositories/comments.repository";
import { CommentDomainDto } from "../domain/comment-domain.dto";
import { CommentEntity } from "../domain/comment";
import {
  CreateCommentCommand,
  UpdateCommentCommand,
} from "./command-handlers/comment-commands";
import { ForbiddenError } from "../../../core/errors/forbidden.error";

export class CommentsService {
  private commentsRepository: CommentsRepository;
  constructor() {
    this.commentsRepository = new CommentsRepository();
  }

  async create(command: CreateCommentCommand): Promise<string> {
    const { content, postId, commentatorInfo } = command;

    const newCommentCommand: CommentDomainDto = {
      content,
      postId,
      commentatorInfo,
    };
    const newComment = CommentEntity.create(newCommentCommand);

    const createdComment = await this.commentsRepository.save(newComment);
    return createdComment._id!.toString();
  }

  async update(command: UpdateCommentCommand, userId: string): Promise<void> {
    const { id, ...updateCommentDomainDto } = command;

    const userComment = await this.commentsRepository.findByIdOrFail(id);

    if (userComment.commentatorInfo.userId !== userId) {
      throw new ForbiddenError("You cannot delete someone else's comment");
    }

    userComment.update(updateCommentDomainDto);

    await this.commentsRepository.save(userComment);

    return;
  }

  async delete(id: string, userId: string): Promise<void> {
    const userComment = await this.commentsRepository.findByIdOrFail(id);

    if (userComment.commentatorInfo.userId !== userId) {
      throw new ForbiddenError("You cannot delete someone else's comment");
    }

    await this.commentsRepository.delete(id);
  }

  async deleteMany(): Promise<void> {
    await this.commentsRepository.deleteMany();
  }
}

const commentsService = new CommentsService();

export default commentsService;
