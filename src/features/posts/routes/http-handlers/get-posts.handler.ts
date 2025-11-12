import { Response } from "express";
import postsService from "../../application/posts.service";
import ViewPostModel from "../../domain/modeles/ViewModels";
import { PostsKeys } from "../../domain/posts";
import { RequestWithQuery } from "../../../../core/types/request";
import { QueryInput } from "../../../../core/types/input-response";
import { PaginatedOutputWithItems } from "../../../../core/types/paginated.output";
import { buildValidatedQuery } from "../../../../core/middlewares/validation/build-validated-query";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { mapToPostPaginatedOutput } from "../../application/mappers/map-to-post-pagination-output.util";

export const getPostsHandler = async (
  req: RequestWithQuery<QueryInput<PostsKeys>>,
  res: Response<PaginatedOutputWithItems<ViewPostModel>>,
): Promise<void> => {
  try {
    const queryInput: QueryInput<PostsKeys> =
      buildValidatedQuery<PostsKeys>(req);
    const { items, totalCount } = await postsService.findMany(queryInput);
    const postsListOutput = mapToPostPaginatedOutput<ViewPostModel>(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.status(HTTP_STATUSES.OK_200).json(postsListOutput);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
