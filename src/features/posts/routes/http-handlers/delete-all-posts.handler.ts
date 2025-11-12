import { Request, Response } from "express";
import postsService from "../../application/posts.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";

export const deleteAllPostsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await postsService.deleteMany();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
