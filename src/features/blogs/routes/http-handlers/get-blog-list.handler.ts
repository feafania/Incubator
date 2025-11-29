import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { BlogListRequestPayload } from "../request-payloads/blog-list-request.payload";
import { setDefaultSortAndPaginationIfNotExist } from "../../../../core/helpers/set-default-sort-and-pagination";
import { blogQueryService } from "../../application/blogs.query.service";

export const getBlogListHandler = async (
  req: Request<{}, {}, {}, BlogListRequestPayload>,
  res: Response,
): Promise<void> => {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(
      req.query,
    ) as BlogListRequestPayload;
    const blogsListOutput = await blogQueryService.findMany(queryInput);
    res.send(blogsListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
