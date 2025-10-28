import { Response } from "express";
import { OutputErrorsType, RequestWithParamsAndBody } from "../../../db/types";
import { HTTP_STATUSES } from "../../../db/utils";
import postsService from "../posts.service";
import UpdatePostInputModel, {
  UpdatePostInputModelByID,
} from "../modeles/UpdateModels";
import ViewPostModel from "../modeles/ViewModels";

export const updatePostController = async (
  req: RequestWithParamsAndBody<UpdatePostInputModelByID, UpdatePostInputModel>,
  res: Response<ViewPostModel | OutputErrorsType>,
) => {
  try {
    const postIndex = await postsService.findIndex(req.params.id);
    if (postIndex === -1) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    const inputResult = await postsService.update(postIndex, req.body);

    if (inputResult && "errors" in inputResult) {
      // если есть ошибки - отправляем ошибки
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json(inputResult.errors);
      return;
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
