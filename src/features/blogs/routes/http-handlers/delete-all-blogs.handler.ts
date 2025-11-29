import { Request, Response } from "express";
import blogsService from "../../application/blogs.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";

export const deleteAllBlogsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await blogsService.deleteMany();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
