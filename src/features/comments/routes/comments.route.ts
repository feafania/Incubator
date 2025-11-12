import { Router } from "express";
import { deleteCommentHandler } from "./http-handlers/delete-comment.handler";
import { updateCommentHandler } from "./http-handlers/update-comment.handler";
import { getCommentHandler } from "./http-handlers/get-comment-list.handler";
import { accessTokenGuardMiddleware } from "../../../auth/middlewares/access-token-guard.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { updateCommentRequestPayloadValidation } from "./comment-request.payload.validation-middlewares";

export const commentsRouter = Router({});

commentsRouter
  .get("/:id", idValidation, inputValidationResultMiddleware, getCommentHandler)

  .put(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    updateCommentRequestPayloadValidation,
    inputValidationResultMiddleware,
    updateCommentHandler,
  )

  .delete(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteCommentHandler,
  );
