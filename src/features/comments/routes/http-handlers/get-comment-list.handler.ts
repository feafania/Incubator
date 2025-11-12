import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { commentQueryService } from "../../application/comment.query.service";

export async function getCommentHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const commentOutput = await commentQueryService.findByIdOrFail(
      req.params.id,
    );
    res.send(commentOutput); //200 па змоўчаньні і ў json фармаце для аб'екта
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
