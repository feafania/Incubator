import { Router } from "express";
import { accessTokenGuardMiddleware } from "../../../auth/middlewares/access-token-guard.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {
  setLikeStatusRequestPayloadValidation,
  updateCommentRequestPayloadValidation,
} from "./comment-request.payload.validation-middlewares";
import { container } from "../../../composition-root";
import { CommentsController } from "./controllers/comments.controller";
import { accessTokenOptionalMiddleware } from "../../../auth/middlewares/access-token-optional.middleware";
import { LIKE_STATUS_PATH } from "../../../core/paths/paths";

export const commentsRouter = Router({});

const commentsController =
  container.get<CommentsController>(CommentsController);

commentsRouter
  .get(
    "/:id",
    accessTokenOptionalMiddleware,
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
  )

  .put(
    `/:id${LIKE_STATUS_PATH}`,
    accessTokenGuardMiddleware,
    idValidation,
    setLikeStatusRequestPayloadValidation,
    inputValidationResultMiddleware,
    commentsController.setLikeStatusHandler.bind(commentsController),
  );
