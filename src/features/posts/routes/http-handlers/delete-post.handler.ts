import { Request, Response } from "express";

import postsService from "../../application/posts.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";

export const deletePostHandler = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const postIndex = await postsService.findIndex(req.params.id);
    if (!postIndex) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    await postsService.delete(req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
