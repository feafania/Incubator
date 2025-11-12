import { Response } from "express";
import blogsService from "../../application/blogs.service";
import GetBlogModelById from "../../domain/modeles/ReadModels";
import ViewBlogModel from "../../domain/modeles/ViewModels";
import { RequestWithParams } from "../../../../core/types/request";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";

export const findBlogHandler = async (
  req: RequestWithParams<GetBlogModelById>,
  res: Response<ViewBlogModel>,
): Promise<void> => {
  try {
    const foundBlog = await blogsService.findByIDForOutput(req.params.id);
    if (!foundBlog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    res.status(HTTP_STATUSES.OK_200).json(foundBlog);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
