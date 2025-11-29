import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { PostListRequestPayload } from "../request-payloads/post-list-request.payload";
import { postQueryService } from "../../application/posts.query.service";
import { setDefaultSortAndPaginationIfNotExist } from "../../../../core/helpers/set-default-sort-and-pagination";

export const getPostListHandler = async (
  req: Request<{}, {}, {}, PostListRequestPayload>,
  res: Response,
): Promise<void> => {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(
      req.query,
    ) as PostListRequestPayload;
    const postsListOutput = await postQueryService.findMany(queryInput);
    res.send(postsListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
