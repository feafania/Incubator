import { Response } from "express";
import { OutputErrorsType, RequestWithBody } from "../../../db/types";
import { HTTP_STATUSES } from "../../../db/utils";
import postsService from "../posts.service";
import CreatePostInputModel from "../modeles/CreateModels";
import ViewPostModel from "../modeles/ViewModels";

export const createPostController = async (
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
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
