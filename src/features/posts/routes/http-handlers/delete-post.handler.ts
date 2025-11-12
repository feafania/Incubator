import { Response } from "express";

import postsService from "../../application/posts.service";
import GetPostModelById from "../../domain/modeles/ReadModels";
import { RequestWithParams } from "../../../../core/types/request";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";

export const deletePostHandler = async (
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
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
