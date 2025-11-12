import { Response } from "express";
import blogsService from "../application/blogs.service";
import ViewBlogModel from "../domain/modeles/ViewModels";
import { BlogsKeys } from "../domain/blogs";
import { RequestWithQuery } from "../../../core/types/request";
import { QueryInput } from "../../../core/types/input-response";
import { PaginatedOutputWithItems } from "../../../core/types/paginated.output";
import { buildValidatedQuery } from "../../../core/middlewares/validation/build-validated-query";
import { mapToPaginatedOutput } from "../../../core/utils";
import { HTTP_STATUSES } from "../../../core/types/http-statuses";

export const getBlogsController = async (
  req: RequestWithQuery<QueryInput<BlogsKeys>>,
  res: Response<PaginatedOutputWithItems<ViewBlogModel>>,
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
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
