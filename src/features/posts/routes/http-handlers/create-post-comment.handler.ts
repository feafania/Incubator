import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { CreateCommentRequestPayload } from "../../../comments/routes/request-payloads/create-comment-request.payload";
import postsService from "../../application/posts.service";
import commentsService from "../../../comments/application/comments.service";
import { authQueryService } from "../../../auth/application/auth.query.service";
import { commentQueryService } from "../../../comments/application/comment.query.service";

export async function createPostCommentHandler(
  req: Request<{ id: string }, {}, CreateCommentRequestPayload>,
  res: Response,
) {
  try {
    const foundPost = await postsService.findByIdOrFail(req.params.id);
    if (!foundPost) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    const userId = req.userId;

    if (!userId) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }
    const commentator = await authQueryService.findByIdOrFail(userId);
    const inputWithPost = {
      ...req.body,
      postId: req.params.id,
      commentatorInfo: {
        userId: commentator.userId,
        userLogin: commentator.login,
      },
    };
    const createdCommentId = await commentsService.create(inputWithPost);

    const commentOutput =
      await commentQueryService.findByIdOrFail(createdCommentId);

    res.status(HTTP_STATUSES.CREATE_201).send(commentOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
