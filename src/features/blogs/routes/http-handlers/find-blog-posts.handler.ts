import { Response } from "express";
import blogsService from "../../application/blogs.service";
import GetBlogModelById from "../../domain/modeles/ReadModels";
import { PostsKeys } from "../../../posts/domain/posts";
import ViewPostModel from "../../../posts/domain/modeles/ViewModels";
import postsService from "../../../posts/application/posts.service";
import { RequestWithParamsAndQuery } from "../../../../core/types/request";
import { QueryInput } from "../../../../core/types/input-response";
import { PaginatedOutputWithItems } from "../../../../core/types/paginated.output";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { buildValidatedQuery } from "../../../../core/middlewares/validation/build-validated-query";
import { mapToBlogPaginatedOutput } from "../../application/mappers/map-to-blog-pagination-output.util";

export const findBlogPostsHandler = async (
  req: RequestWithParamsAndQuery<GetBlogModelById, QueryInput<PostsKeys>>,
  res: Response<PaginatedOutputWithItems<ViewPostModel>>,
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
    const postsListOutput = mapToBlogPaginatedOutput<ViewPostModel>(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.status(HTTP_STATUSES.OK_200).json(postsListOutput);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
