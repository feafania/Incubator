import { Request, Response } from "express";
import blogsService from "../../application/blogs.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import CreateBlogRequestPayload from "../request-payloads/create-blog-request.payload";
import { blogQueryService } from "../../application/blogs.query.service";

export const createBlogHandler = async (
  req: Request<{}, {}, CreateBlogRequestPayload>,
  res: Response,
) => {
  try {
    const createdPostId = await blogsService.create(req.body);
    const post = await blogQueryService.findByIdOrFail(createdPostId);

    res.status(HTTP_STATUSES.CREATE_201).send(post);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
