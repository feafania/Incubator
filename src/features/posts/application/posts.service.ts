import { Post } from "../domain/posts";
import { PostsRepository } from "../repositories/posts.repository";
import { ObjectId, WithId } from "mongodb";
import {
  CreatePostCommand,
  UpdatePostCommand,
} from "./command-handlers/post-commands";
import { inject, injectable } from "inversify";
import { SetLikeCommand } from "../../likes/application/command-handlers/like-commands";
import { LikeStatus } from "../../likes/domain/like-status-type";
import { LikesService } from "../../likes/application/likes.service";
import { CommentsService } from "../../comments/application/comments.service";

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository)
    private postsRepository: PostsRepository,
    @inject(LikesService) private likesService: LikesService,
    @inject(CommentsService) private commentsService: CommentsService,
  ) {}

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    return await this.postsRepository.findByIdOrFail(id);
  }

  async findIndex(id: string): Promise<ObjectId | null> {
    return await this.postsRepository.findIndex(id);
  }

  async deleteMany(): Promise<void> {
    await this.postsRepository.deleteMany();
  }

  async deleteByBlogId(id: string): Promise<void> {
    const deletedPosts = await this.postsRepository.deleteByBlogId(id);
    await Promise.all(
      deletedPosts.flatMap((postId) => [
        this.commentsService.deleteByPostId(postId),
        this.likesService.deleteByParentId(postId),
      ]),
    );
  }

  async delete(id: string): Promise<void> {
    await this.postsRepository.delete(id);
    await this.commentsService.deleteByPostId(id);
  }

  async create(command: CreatePostCommand): Promise<string> {
    const newPost = Post.create(command);

    const createdPost = await this.postsRepository.save(newPost);
    return createdPost._id!.toString();
  }

  async update(command: UpdatePostCommand): Promise<void> {
    const { id, ...updateCommentDomainDto } = command;

    const post = await this.postsRepository.findByIdOrFail(id);

    post.update(updateCommentDomainDto);

    await this.postsRepository.save(post);

    return;
  }

  async setLikeStatus(command: SetLikeCommand): Promise<void> {
    const { status, userId, entityId: postId } = command;
    const userPost = await this.postsRepository.findByIdOrFail(postId);
    const like = await this.likesService.findByAuthorAndParent(userId, postId);

    const oldStatus = like ? like.status : LikeStatus.NONE;

    if (like) {
      await this.likesService.update({ status, id: like._id.toString() });
    } else {
      await this.likesService.create({
        status,
        authorId: userId,
        parentId: postId,
      });
    }

    if (status === LikeStatus.LIKE) {
      userPost.addToNewestLikes(userId);
    } else if (oldStatus === LikeStatus.LIKE) {
      userPost.removeFromNewestLikes(userId);
    }

    userPost.setLikeCount(status, oldStatus);
    await this.postsRepository.save(userPost);
  }
}
