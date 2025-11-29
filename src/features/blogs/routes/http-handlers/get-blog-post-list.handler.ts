import { Request, Response } from "express";
import blogsService from "../../application/blogs.service";
import { PostListRequestPayload } from "../../../posts/routes/request-payloads/post-list-request.payload";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { setDefaultSortAndPaginationIfNotExist } from "../../../../core/helpers/set-default-sort-and-pagination";
import { postQueryService } from "../../../posts/application/posts.query.service";

export const getBlogPostListHandler = async (
  req: Request<{ id: string }, {}, {}, PostListRequestPayload>,
  res: Response,
): Promise<void> => {
  try {
    const foundBlog = await blogsService.findByIdOrFail(req.params.id);

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
