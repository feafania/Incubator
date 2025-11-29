import { Request, Response } from "express";
import blogsService from "../../application/blogs.service";
import postsService from "../../../posts/application/posts.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import CreatePostRequestPayload from "../../../posts/routes/request-payloads/create-post-request.payload";
import PostOutput from "../../../posts/application/output/post.output";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { postQueryService } from "../../../posts/application/posts.query.service";

export const createBlogPostListHandler = async (
  req: Request<{ id: string }, {}, Omit<CreatePostRequestPayload, "blogId">>,
  res: Response<PostOutput>,
): Promise<void> => {
  try {
    const foundBlog = await blogsService.findByIdOrFail(req.params.id);

    const inputWithBlog = {
      ...req.body,
      blogId: foundBlog._id.toString(),
    };
    const createdPostId = await postsService.create(inputWithBlog);
    const post = await postQueryService.findByIdOrFail(createdPostId);

    res.status(HTTP_STATUSES.CREATE_201).send(post);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
