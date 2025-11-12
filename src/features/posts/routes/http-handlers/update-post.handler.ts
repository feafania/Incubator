import { Response } from "express";
import postsService from "../../application/posts.service";
import UpdatePostInputModel, {
  UpdatePostInputModelByID,
} from "../../domain/modeles/UpdateModels";
import ViewPostModel from "../../domain/modeles/ViewModels";
import { RequestWithParamsAndBody } from "../../../../core/types/request";
import { OutputErrorsType } from "../../../../core/errors/types/errors";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";

export const updatePostHandler = async (
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
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
