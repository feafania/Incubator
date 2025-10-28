import blogsService from "../blogs/blogs.service";
import {
  FindQueryResponse,
  PostDBType,
  PostReturnType,
  PostsKeys,
  QueryInput,
} from "../../db/types";
import postsRepository from "./repositories/posts.repository";
import ViewPostModel from "./modeles/ViewModels";
import CreatePostInputModel from "./modeles/CreateModels";
import { createError } from "../../db/utils";
import UpdatePostInputModel from "./modeles/UpdateModels";

const postsService = {
  async findByID(
    id: string | number | undefined,
  ): Promise<PostDBType | null | undefined> {
    return await postsRepository.findByID(id);
  },
  async findIndex(id: string | number | undefined): Promise<number> {
    return await postsRepository.findIndex(id);
  },
  async findMany(
    queryDTO: QueryInput<PostsKeys>,
    blogId?: string | number,
  ): Promise<FindQueryResponse<ViewPostModel>> {
    const { items, totalCount } = await postsRepository.findMany(
      queryDTO,
      blogId,
    );
    return {
      items: await Promise.all(items.map((item) => this.mapToOutput(item))),
      totalCount,
    };
  },
  async findByIDForOutput(
    id: string | number | undefined,
  ): Promise<ViewPostModel | null> {
    const foundPost = await this.findByID(id);
    if (!foundPost) {
      return null;
    }
    return this.mapToOutput(foundPost);
  },
  async deleteAllPosts(): Promise<void> {
    await postsRepository.deleteAllPosts();
  },
  async deletePost(id: number): Promise<boolean> {
    return postsRepository.deletePost(id);
  },
  async create(input: CreatePostInputModel): Promise<PostReturnType> {
    const newPost: PostDBType = {
      ...input,
      id: Date.now() + Math.random(),
      title: input.title ? input.title.trim() : "",
      shortDescription: input.shortDescription
        ? input.shortDescription.trim()
        : "",
      content: input.content ? input.content.trim() : "",
      blogId: input.blogId ? Number(input.blogId.trim()) : 0,
      createdAt: new Date(),
    };
    try {
      const createdPost = await postsRepository.create(newPost);
      return { post: await this.mapToOutput(createdPost) };
    } catch (err) {
      return { errors: createError(err, "") };
    }
  },
  async update(
    index: number,
    input: UpdatePostInputModel,
  ): Promise<PostReturnType> {
    try {
      const postToUpdate: PostDBType = {
        id: index,
        title: input.title || "",
        shortDescription: input.shortDescription || "",
        content: input.content || "",
        blogId: +input.blogId,
        createdAt: new Date(),
      };

      const updatedPost = await postsRepository.update(postToUpdate);
      return { post: await this.mapToOutput(updatedPost) };
    } catch (err) {
      return { errors: createError(err, "") };
    }
  },
  async mapToOutput(model: PostDBType): Promise<ViewPostModel> {
    try {
      let blogName: string;

      if (model.blogName) {
        blogName = model.blogName;
      } else {
        const foundBlog = await blogsService.findByID(model.blogId);
        blogName = foundBlog?.name ?? "";
      }

      return {
        id: model.id.toString() ?? "",
        title: model.title,
        shortDescription: model.shortDescription,
        content: model.content,
        blogId: model.blogId.toString() ?? "",
        blogName: blogName,
        createdAt: model.createdAt.toISOString(),
      };
    } catch (err) {
      throw new Error("Unexpected structure of records");
    }
  },
};

export default postsService;
