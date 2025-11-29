import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import PostOutput from "../../application/output/post.output";
import UpdatePostRequestPayload from "../request-payloads/update-post-request.payload";
import postsService from "../../application/posts.service";

export const updatePostHandler = async (
  req: Request<{ id: string }, {}, UpdatePostRequestPayload>,
  res: Response<PostOutput>,
) => {
  try {
    const id = req.params.id;
    const postIndex = await postsService.findIndex(id);
    if (!postIndex) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    await postsService.update({ id, ...req.body });

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
