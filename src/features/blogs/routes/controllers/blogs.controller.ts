import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { setDefaultSortAndPaginationIfNotExist } from "../../../../core/helpers/set-default-sort-and-pagination";
import CreateBlogRequestPayload from "../request-payloads/create-blog-request.payload";
import CreatePostRequestPayload from "../../../posts/routes/request-payloads/create-post-request.payload";
import PostOutput from "../../../posts/application/output/post.output";
import BlogOutput from "../../application/output/blog.output";
import { BlogListRequestPayload } from "../request-payloads/blog-list-request.payload";
import { PostListRequestPayload } from "../../../posts/routes/request-payloads/post-list-request.payload";
import UpdateBlogRequestPayload from "../request-payloads/update-blog-request.payload";
import { BlogsService } from "../../application/blogs.service";
import { BlogQueryService } from "../../application/blog.query.service";
import { PostsService } from "../../../posts/application/posts.service";
import { PostQueryService } from "../../../posts/application/post.query.service";

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService) private blogsService: BlogsService,
    @inject(BlogQueryService) private blogQueryService: BlogQueryService,
    @inject(PostsService) private postsService: PostsService,
    @inject(PostQueryService) private postQueryService: PostQueryService,
  ) {}

  async createBlogHandler(
    req: Request<{}, {}, CreateBlogRequestPayload>,
    res: Response,
  ) {
    try {
      const createdPostId = await this.blogsService.create(req.body);
      const blog = await this.blogQueryService.findByIdOrFail(createdPostId);

      res.status(HTTP_STATUSES.CREATE_201).send(blog);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async createBlogPostListHandler(
    req: Request<{ id: string }, {}, Omit<CreatePostRequestPayload, "blogId">>,
    res: Response<PostOutput>,
  ): Promise<void> {
    try {
      const foundBlog = await this.blogsService.findByIdOrFail(req.params.id);

      const inputWithBlog = {
        ...req.body,
        blogId: foundBlog._id.toString(),
      };
      const createdPostId = await this.postsService.create(inputWithBlog);
      const post = await this.postQueryService.findByIdOrFail(createdPostId);

      res.status(HTTP_STATUSES.CREATE_201).send(post);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deleteAllBlogsHandler(req: Request, res: Response): Promise<void> {
    try {
      await this.blogsService.deleteMany();
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      return;
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deleteBlogHandler(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      const blogIndex = await this.blogsService.findIndex(req.params.id);
      if (!blogIndex) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }
      await this.blogsService.delete(req.params.id);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      return;
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async findBlogHandler(
    req: Request<{ id: string }>,
    res: Response<BlogOutput>,
  ): Promise<void> {
    try {
      const foundBlog = await this.blogQueryService.findByIdOrFail(
        req.params.id,
      );
      res.status(HTTP_STATUSES.OK_200).json(foundBlog);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getBlogListHandler(
    req: Request<{}, {}, {}, BlogListRequestPayload>,
    res: Response,
  ): Promise<void> {
    try {
      const queryInput = setDefaultSortAndPaginationIfNotExist(
        req.query,
      ) as BlogListRequestPayload;
      const blogsListOutput = await this.blogQueryService.findMany(queryInput);
      res.send(blogsListOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getBlogPostListHandler(
    req: Request<{ id: string }, {}, {}, PostListRequestPayload>,
    res: Response,
  ): Promise<void> {
    try {
      const foundBlog = await this.blogsService.findByIdOrFail(req.params.id);

      const queryInput = setDefaultSortAndPaginationIfNotExist(
        req.query,
      ) as PostListRequestPayload;
      const postsListOutput = await this.postQueryService.findMany(
        queryInput,
        foundBlog._id.toString(),
        req.userId ?? undefined,
      );
      res.send(postsListOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async updateBlogHandler(
    req: Request<{ id: string }, {}, UpdateBlogRequestPayload>,
    res: Response<BlogOutput>,
  ) {
    try {
      const id = req.params.id;
      const blogIndex = await this.blogsService.findIndex(id);
      if (!blogIndex) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      await this.blogsService.update({ id, ...req.body });

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      return;
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
