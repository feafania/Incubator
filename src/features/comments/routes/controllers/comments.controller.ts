import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { UpdateCommentRequestPayload } from "../request-payloads/update-comment-request.payload";
import { CommentsService } from "../../application/comments.service";
import { CommentQueryService } from "../../application/comment.query.service";
import { SetLikeRequestPayload } from "../request-payloads/set-like-request.payload";
import { LikeStatus } from "../../../likes/domain/like-status-type";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService) private commentsService: CommentsService,
    @inject(CommentQueryService)
    private commentQueryService: CommentQueryService,
  ) {}

  async deleteCommentHandler(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;
      const userId = req.userId;

      if (!userId) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        return;
      }

      await this.commentsService.delete(id, userId);

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getCommentHandler(req: Request<{ id: string }>, res: Response) {
    try {
      const commentOutput = await this.commentQueryService.findByIdOrFail(
        req.params.id,
        req.userId ?? undefined,
      );
      res.send(commentOutput); //200 па змоўчаньні і ў json фармаце для аб'екта
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async updateCommentHandler(
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

      await this.commentsService.update({ id, ...req.body }, userId);

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async setLikeStatusHandler(
    req: Request<{ id: string }, {}, SetLikeRequestPayload>,
    res: Response,
  ) {
    try {
      const commentId = req.params.id;
      const userId = req.userId;

      if (!userId) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        return;
      }

      await this.commentsService.setLikeStatus({
        status: req.body.likeStatus as LikeStatus,
        commentId,
        userId,
      });

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
