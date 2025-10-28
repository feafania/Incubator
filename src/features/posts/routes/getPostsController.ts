import { HTTP_STATUSES, mapToPaginatedOutput } from "../../../db/utils";
import { Response } from "express";
import postsService from "../posts.service";
import ViewPostModel from "../modeles/ViewModels";
import {
  PaginatedOutput,
  PostsKeys,
  QueryInput,
  RequestWithQuery,
} from "../../../db/types";
import { buildValidatedQuery } from "../../utils";

export const getPostsController = async (
  req: RequestWithQuery<QueryInput<PostsKeys>>,
  res: Response<PaginatedOutput<ViewPostModel>>,
): Promise<void> => {
  try {
    const queryInput: QueryInput<PostsKeys> =
      buildValidatedQuery<PostsKeys>(req);
    const { items, totalCount } = await postsService.findMany(queryInput);
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
