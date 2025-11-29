import { Request, Response } from "express";
import blogsService from "../../application/blogs.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";

export const deleteBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const blogIndex = await blogsService.findIndex(req.params.id);
    if (!blogIndex) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    await blogsService.delete(req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
