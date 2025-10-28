import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../db/utils";
import postsService from "../posts.service";

export const deleteAllPostsData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await postsService.deleteAllPosts();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
