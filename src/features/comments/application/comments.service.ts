import { CommentsRepository } from "../repositories/comments.repository";
import { CommentDomainDto } from "../domain/comment-domain.dto";
import { CommentEntity } from "../domain/comment";
import {
  CreateCommentCommand,
  UpdateCommentCommand,
} from "./command-handlers/comment-commands";
import { ForbiddenError } from "../../../core/errors/forbidden.error";
import { inject, injectable } from "inversify";
import { LikesService } from "../../likes/application/likes.service";
import { SetLikeCommand } from "../../likes/application/command-handlers/like-commands";
import { LikeStatus } from "../../likes/domain/like-status-type";

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository) private commentsRepository: CommentsRepository,
    @inject(LikesService) private likesService: LikesService,
  ) {}

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

  async deleteByPostId(id: string): Promise<void> {
    const deletedComments = await this.commentsRepository.deleteByPostId(id);
    await Promise.all(
      deletedComments.map(async (commentId) => {
        await this.likesService.deleteByParentId(commentId);
      }),
    );
  }

  async setLikeStatus(command: SetLikeCommand): Promise<void> {
    const { status, userId, entityId: commentId } = command;
    const userComment = await this.commentsRepository.findByIdOrFail(commentId);
    const like = await this.likesService.findByAuthorAndParent(
      userId,
      commentId,
    );

    const oldStatus = like ? like.status : LikeStatus.NONE;

    if (like) {
      await this.likesService.update({ status, id: like._id.toString() });
    } else {
      await this.likesService.create({
        status,
        authorId: userId,
        parentId: commentId,
      });
    }
    userComment.setLikeCount(status, oldStatus);
    await this.commentsRepository.save(userComment);
  }
}
