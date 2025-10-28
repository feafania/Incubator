import { Response } from "express";
import { HTTP_STATUSES } from "../../../db/utils";
import { RequestWithParams } from "../../../db/types";
import postsService from "../posts.service";
import GetPostModelById from "../modeles/ReadModels";

export const deletePostController = async (
  req: RequestWithParams<GetPostModelById>,
  res: Response,
): Promise<void> => {
  try {
    const postIndex = await postsService.findIndex(req.params.id);
    if (postIndex === -1) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    await postsService.deletePost(postIndex);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
