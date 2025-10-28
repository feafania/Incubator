import { HTTP_STATUSES, mapToPaginatedOutput } from "../../../db/utils";
import { Response, Request } from "express";
import blogsService from "../blogs.service";
import ViewBlogModel from "../modeles/ViewModels";
import {
  QueryInput,
  PaginatedOutput,
  RequestWithQuery,
  BlogsKeys,
  RequestWithParamsAndBody,
  OutputErrorsType,
} from "../../../db/types";
import GetBlogModelById from "../modeles/ReadModels";
import CreatePostInputModel from "../../posts/modeles/CreateModels";
import ViewPostModel from "../../posts/modeles/ViewModels";
import postsService from "../../posts/posts.service";

export const createBlogPostController = async (
  req: RequestWithParamsAndBody<GetBlogModelById, CreatePostInputModel>,
  res: Response<ViewPostModel | OutputErrorsType>,
): Promise<void> => {
  try {
    const foundBlog = await blogsService.findByID(req.params.id);
    if (!foundBlog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    const inputWithBlog = {
      ...req.body,
      blogId: req.params.id.toString(),
    };
    const inputResult = await postsService.create(inputWithBlog);
    if ("errors" in inputResult) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json(inputResult.errors);
      return;
    }
    res.status(HTTP_STATUSES.CREATE_201).json(inputResult.post);
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
