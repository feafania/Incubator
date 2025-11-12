import { Request, Response } from "express";
import blogsService from "../application/blogs.service";
import { HTTP_STATUSES } from "../../../core/types/http-statuses";

export const deleteAllBlogsData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await blogsService.deleteMany();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
