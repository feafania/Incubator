import { Response } from "express";
import blogsService from "../../application/blogs.service";
import CreateBlogInputModel from "../../domain/modeles/CreateModels";
import ViewBlogModel from "../../domain/modeles/ViewModels";
import { RequestWithBody } from "../../../../core/types/request";
import { OutputErrorsType } from "../../../../core/errors/types/errors";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";

export const createBlogHandler = async (
  req: RequestWithBody<CreateBlogInputModel>,
  res: Response<ViewBlogModel | OutputErrorsType>,
) => {
  try {
    const inputResult = await blogsService.create(req.body);
    if ("errors" in inputResult) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json(inputResult.errors);
      return;
    }
    res.status(HTTP_STATUSES.CREATE_201).json(inputResult.blog);
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
