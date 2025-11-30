import { Router } from "express";
import { accessTokenGuardMiddleware } from "../../../auth/middlewares/access-token-guard.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { updateCommentRequestPayloadValidation } from "./comment-request.payload.validation-middlewares";
import { container } from "../../../composition-root";
import { CommentsController } from "./controllers/comments.controller";

export const commentsRouter = Router({});

const commentsController =
  container.get<CommentsController>(CommentsController);

commentsRouter
  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    commentsController.getCommentHandler.bind(commentsController),
  )

  .put(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    updateCommentRequestPayloadValidation,
    inputValidationResultMiddleware,
    commentsController.updateCommentHandler.bind(commentsController),
  )

  .delete(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    commentsController.deleteCommentHandler.bind(commentsController),
  );
