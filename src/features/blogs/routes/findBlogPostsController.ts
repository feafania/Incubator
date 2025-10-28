import { Response } from "express";
import { HTTP_STATUSES, mapToPaginatedOutput } from "../../../db/utils";
import {
  PaginatedOutput,
  PostsKeys,
  QueryInput,
  RequestWithParamsAndQuery,
} from "../../../db/types";
import blogsService from "../blogs.service";
import GetBlogModelById from "../modeles/ReadModels";
import postsService from "../../posts/posts.service";
import ViewPostModel from "../../posts/modeles/ViewModels";
import { buildValidatedQuery } from "../../utils";

export const findBlogPostsController = async (
  req: RequestWithParamsAndQuery<GetBlogModelById, QueryInput<PostsKeys>>,
  res: Response<PaginatedOutput<ViewPostModel>>,
): Promise<void> => {
  try {
    const foundBlog = await blogsService.findByID(req.params.id);
    if (!foundBlog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    const queryInput: QueryInput<PostsKeys> =
      buildValidatedQuery<PostsKeys>(req);
    const { items, totalCount } = await postsService.findMany(
      queryInput,
      foundBlog.id,
    );
    const postsListOutput = mapToPaginatedOutput<ViewPostModel>(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.status(HTTP_STATUSES.OK_200).json(postsListOutput);
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
