import { Response } from "express";
import blogsService from "../../application/blogs.service";
import GetBlogModelById from "../../domain/modeles/ReadModels";
import { RequestWithParamsAndQuery } from "../../../../core/types/request";

import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { PostListRequestPayload } from "../../../posts/routes/request-payloads/post-list-request.payload";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { setDefaultSortAndPaginationIfNotExist } from "../../../../core/helpers/set-default-sort-and-pagination";
import { postQueryService } from "../../../posts/application/posts.query.service";

export const findBlogPostsHandler = async (
  req: RequestWithParamsAndQuery<GetBlogModelById, PostListRequestPayload>,
  res: Response,
): Promise<void> => {
  try {
    const foundBlog = await blogsService.findByID(req.params.id);
    if (!foundBlog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    const queryInput = setDefaultSortAndPaginationIfNotExist(
      req.query,
    ) as PostListRequestPayload;
    const postsListOutput = await postQueryService.findMany(
      queryInput,
      foundBlog._id.toString(),
    );
    res.send(postsListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
