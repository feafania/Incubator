import { HTTP_STATUSES, mapToPaginatedOutput } from "../../../db/utils";
import { Response, Request } from "express";
import blogsService from "../blogs.service";
import ViewBlogModel from "../modeles/ViewModels";
import {
  QueryInput,
  PaginatedOutput,
  RequestWithQuery,
  BlogsKeys,
} from "../../../db/types";
import { buildValidatedQuery } from "../../utils";

export const getBlogsController = async (
  req: RequestWithQuery<QueryInput<BlogsKeys>>,
  res: Response<PaginatedOutput<ViewBlogModel>>,
): Promise<void> => {
  try {
    const queryInput: QueryInput<BlogsKeys> =
      buildValidatedQuery<BlogsKeys>(req);
    // console.log("queryInput", queryInput);
    const { items, totalCount } = await blogsService.findMany(queryInput);
    // console.log("items", items);
    const blogsListOutput = mapToPaginatedOutput<ViewBlogModel>(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.status(HTTP_STATUSES.OK_200).json(blogsListOutput);
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
