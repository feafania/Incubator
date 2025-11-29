import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import BlogOutput from "../../application/output/blog.output";
import { blogQueryService } from "../../application/blogs.query.service";

export const findBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response<BlogOutput>,
): Promise<void> => {
  try {
    const foundBlog = await blogQueryService.findByIdOrFail(req.params.id);
    res.status(HTTP_STATUSES.OK_200).json(foundBlog);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
