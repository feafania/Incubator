import { Request, Response } from "express";
import postsService from "../../application/posts.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import CreatePostRequestPayload from "../request-payloads/create-post-request.payload";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { postQueryService } from "../../application/posts.query.service";

export const createPostHandler = async (
  req: Request<{}, {}, CreatePostRequestPayload>,
  res: Response,
) => {
  try {
    const createdPostId = await postsService.create(req.body);
    const post = await postQueryService.findByIdOrFail(createdPostId);

    res.status(HTTP_STATUSES.CREATE_201).send(post);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
