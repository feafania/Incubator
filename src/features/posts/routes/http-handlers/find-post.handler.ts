import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { postQueryService } from "../../application/posts.query.service";
import PostOutput from "../../application/output/post.output";
import { errorsHandler } from "../../../../core/errors/errors.handler";

export const findPostHandler = async (
  req: Request<{ id: string }>,
  res: Response<PostOutput>,
): Promise<void> => {
  try {
    const foundPost = await postQueryService.findByIdOrFail(req.params.id);
    res.status(HTTP_STATUSES.OK_200).json(foundPost);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
