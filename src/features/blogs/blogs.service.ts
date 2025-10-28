import {
  BlogDBType,
  BlogReturnType,
  BlogsKeys,
  FindQueryResponse,
  QueryInput,
} from "../../db/types";
import blogsRepository from "./repositories/blogs.repository";
import { createError } from "../../db/utils";
import ViewBlogModel from "./modeles/ViewModels";
import CreateBlogInputModel from "./modeles/CreateModels";
import UpdateBlogInputModel from "./modeles/UpdateModels";

const blogsService = {
  async findByID(
    id: string | number | undefined,
  ): Promise<BlogDBType | null | undefined> {
    return await blogsRepository.findByID(id);
  },
  async findIndex(id: string | number | undefined): Promise<number> {
    return await blogsRepository.findIndex(id);
  },
  async findMany(
    queryDTO: QueryInput<BlogsKeys>,
  ): Promise<FindQueryResponse<ViewBlogModel>> {
    const { items, totalCount } = await blogsRepository.findMany(queryDTO);
    return {
      items: items.map(this.mapToOutput),
      totalCount,
    };
  },
  async findByIDForOutput(
    id: string | number | undefined,
  ): Promise<ViewBlogModel | null> {
    const foundBlog = await this.findByID(id);
    if (!foundBlog) {
      return null;
    }
    return this.mapToOutput(foundBlog);
  },
  async deleteAllBlogs(): Promise<void> {
    await blogsRepository.deleteAllBlogs();
  },
  async deleteBlog(id: number): Promise<boolean> {
    return blogsRepository.deleteBlog(id);
  },
  async create(input: CreateBlogInputModel): Promise<BlogReturnType> {
    const newBlog: BlogDBType = {
      ...input,
      id: Date.now() + Math.random(),
      name: input.name ? input.name.trim() : "",
      description: input.description ? input.description.trim() : "",
      websiteUrl: input.websiteUrl ? input.websiteUrl.trim() : "",
      createdAt: new Date(),
      isMembership: false,
    };
    try {
      const createdBlog = await blogsRepository.create(newBlog);
      return { blog: this.mapToOutput(createdBlog) };
    } catch (err) {
      return { errors: createError(err, "") };
    }
  },
  async update(
    index: number,
    input: UpdateBlogInputModel,
  ): Promise<BlogReturnType> {
    try {
      const blogToUpdate: BlogDBType = {
        id: index,
        name: input.name?.trim() || "",
        description: input.description.trim() || "",
        websiteUrl: input.websiteUrl.trim() || "",
        createdAt: new Date(),
        isMembership: false,
      };

      const updatedBlog = await blogsRepository.update(blogToUpdate);

      return { blog: this.mapToOutput(updatedBlog) };
    } catch (err) {
      return { errors: createError(err, "") };
    }
  },
  mapToOutput(model: BlogDBType): ViewBlogModel {
    try {
      return {
        id: model.id.toString() ?? "", // або любыя значэнні па змаўчанні
        name: model.name,
        description: model.description,
        websiteUrl: model.websiteUrl,
        createdAt: model.createdAt.toISOString(),
        isMembership: model.isMembership,
      };
    } catch (err) {
      throw new Error("Unexpected structure of records");
    }
  },
};
export default blogsService;
