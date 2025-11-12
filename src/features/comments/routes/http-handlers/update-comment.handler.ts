import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { UpdateCommentRequestPayload } from "../request-payloads/update-comment-request.payload";
import commentsService from "../../application/comments.service";

export async function updateCommentHandler(
  req: Request<{ id: string }, {}, UpdateCommentRequestPayload>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const userId = req.userId;

    if (!userId) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    await commentsService.update({ id, ...req.body }, userId);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
