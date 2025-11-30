import { Post } from "../domain/posts";
import { PostsRepository } from "../repositories/posts.repository";
import { ObjectId, WithId } from "mongodb";
import {
  CreatePostCommand,
  UpdatePostCommand,
} from "./command-handlers/post-commands";
import { inject, injectable } from "inversify";

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository)
    private postsRepository: PostsRepository,
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

  async delete(id: string): Promise<void> {
    this.postsRepository.delete(id);
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
}
