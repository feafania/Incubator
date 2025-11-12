import { Response } from "express";
import blogsService from "../../application/blogs.service";

import GetBlogModelById from "../../domain/modeles/ReadModels";
import ViewPostModel from "../../../posts/domain/modeles/ViewModels";
import CreatePostInputModel from "../../../posts/domain/modeles/CreateModels";
import postsService from "../../../posts/application/posts.service";
import { RequestWithParamsAndBody } from "../../../../core/types/request";
import { OutputErrorsType } from "../../../../core/errors/types/errors";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";

export const createBlogPostHandler = async (
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
