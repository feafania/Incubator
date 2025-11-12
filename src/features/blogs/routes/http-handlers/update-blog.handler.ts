import { Response } from "express";
import UpdateBlogInputModel, {
  UpdateBlogInputModelByID,
} from "../../domain/modeles/UpdateModels";
import blogsService from "../../application/blogs.service";
import ViewBlogModel from "../../domain/modeles/ViewModels";
import { RequestWithParamsAndBody } from "../../../../core/types/request";
import { OutputErrorsType } from "../../../../core/errors/types/errors";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";

export const updateBlogHandler = async (
  req: RequestWithParamsAndBody<UpdateBlogInputModelByID, UpdateBlogInputModel>,
  res: Response<ViewBlogModel | OutputErrorsType>,
) => {
  try {
    const blogIndex = await blogsService.findIndex(req.params.id);
    if (blogIndex === -1) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    const inputResult = await blogsService.update(blogIndex, req.body);

    if (inputResult && "errors" in inputResult) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json(inputResult.errors);
      return;
    }

    res.status(HTTP_STATUSES.NO_CONTENT_204).json(inputResult.blog);
    return;
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
