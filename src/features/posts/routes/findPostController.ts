import { Response } from "express";
import postsService from "../application/posts.service";
import GetPostModelById from "../domain/modeles/ReadModels";
import ViewPostModel from "../domain/modeles/ViewModels";
import { RequestWithParams } from "../../../core/types/request";
import { HTTP_STATUSES } from "../../../core/types/http-statuses";

export const findPostController = async (
  req: RequestWithParams<GetPostModelById>,
  res: Response<ViewPostModel>,
): Promise<void> => {
  try {
    const foundPost = await postsService.findByIDForOutput(req.params.id);
    if (!foundPost) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    res.status(HTTP_STATUSES.OK_200).json(foundPost);
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
