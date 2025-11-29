import { Request, Response } from "express";
import blogsService from "../../application/blogs.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import UpdateBlogRequestPayload from "../request-payloads/update-blog-request.payload";
import BlogOutput from "../../application/output/blog.output";

export const updateBlogHandler = async (
  req: Request<{ id: string }, {}, UpdateBlogRequestPayload>,
  res: Response<BlogOutput>,
) => {
  try {
    const id = req.params.id;
    const blogIndex = await blogsService.findIndex(id);
    if (!blogIndex) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    await blogsService.update({ id, ...req.body });

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
