import { Blog } from "../domain/blogs";
import { ObjectId, WithId } from "mongodb";
import { BlogsRepository } from "../repositories/blogs.repository";
import {
  CreateBlogCommand,
  UpdateBlogCommand,
} from "./command-handlers/blog-commands";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository)
    private blogsRepository: BlogsRepository,
  ) {}

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    return await this.blogsRepository.findByIdOrFail(id);
  }

  async findIndex(id: string): Promise<ObjectId | null> {
    return await this.blogsRepository.findIndex(id);
  }

  async deleteMany(): Promise<void> {
    await this.blogsRepository.deleteMany();
  }

  async delete(id: string): Promise<void> {
    this.blogsRepository.delete(id);
  }

  async create(command: CreateBlogCommand): Promise<string> {
    const newBlog = Blog.create(command);

    const createdBlog = await this.blogsRepository.save(newBlog);
    return createdBlog._id!.toString();
  }

  async update(command: UpdateBlogCommand): Promise<void> {
    const { id, ...updateCommentDomainDto } = command;

    const post = await this.blogsRepository.findByIdOrFail(id);

    post.update(updateCommentDomainDto);

    await this.blogsRepository.save(post);

    return;
  }
}
