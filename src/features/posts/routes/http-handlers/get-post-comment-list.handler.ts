import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { setDefaultSortAndPaginationIfNotExist } from "../../../../core/helpers/set-default-sort-and-pagination";
import { CommentListRequestPayload } from "../../../comments/routes/request-payloads/comment-list-request.payload";
import { commentQueryService } from "../../../comments/application/comment.query.service";
import postsService from "../../application/posts.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";

export async function getPostCommentListHandler(
  req: Request<{ id: string }, {}, {}, CommentListRequestPayload>,
  res: Response,
) {
  try {
    const foundPost = await postsService.findByID(req.params.id);
    if (!foundPost) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    const commentsListOutput = await commentQueryService.findCommentsByPost(
      queryInput,
      String(foundPost.id),
    );
    res.send(commentsListOutput); //200 па змоўчаньні і ў json фармаце для аб'екта
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
