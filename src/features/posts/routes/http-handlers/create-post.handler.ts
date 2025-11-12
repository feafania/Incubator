import { Response } from "express";
import postsService from "../../application/posts.service";
import CreatePostInputModel from "../../domain/modeles/CreateModels";
import ViewPostModel from "../../domain/modeles/ViewModels";
import { RequestWithBody } from "../../../../core/types/request";
import { OutputErrorsType } from "../../../../core/errors/types/errors";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";

export const createPostHandler = async (
  req: RequestWithBody<CreatePostInputModel>,
  res: Response<ViewPostModel | OutputErrorsType>,
) => {
  try {
    const inputResult = await postsService.create(req.body);
    if ("errors" in inputResult) {
      // если есть ошибки - отправляем ошибки
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json(inputResult.errors);
      return;
    }
    res.status(HTTP_STATUSES.CREATE_201).json(inputResult.post);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
