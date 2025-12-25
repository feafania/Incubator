import { RequestHandler, Router } from "express";
import {
  postCommentRequestPayloadValidation,
  postRequestPayloadValidation,
} from "./posts-request.payload.validation-middlewares";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { inputCheckErrorsMiddleware } from "../../../core/middlewares/validation/error.middleware";
import { adminGuardMiddleware } from "../../../auth/middlewares/admin-guard.middleware";
import { COMMENTS_PATH } from "../../../core/paths/paths";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { accessTokenGuardMiddleware } from "../../../auth/middlewares/access-token-guard.middleware";
import { CommentSortField } from "../../comments/routes/request-payloads/comment-sort-field";
import { PostSortField } from "./request-payloads/post-sort-field";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";
import { container } from "../../../composition-root";
import { PostsController } from "./controllers/posts.controller";
import { accessTokenOptionalMiddleware } from "../../../auth/middlewares/access-token-optional.middleware";

export const postsRouter = Router();

const postsController = container.get<PostsController>(PostsController);

postsRouter.get(
  "/",
  paginationAndSortingValidation(Object.values(PostSortField)),
  inputCheckErrorsMiddleware,
  postsController.getPostListHandler.bind(
    postsController,
  ) as unknown as RequestHandler,
);
postsRouter.post(
  "/",
  adminGuardMiddleware,
  postRequestPayloadValidation,
  inputValidationResultMiddleware,
  postsController.createPostHandler.bind(postsController),
);
postsRouter.get(
  "/:id",
  idValidation,
  postsController.findPostHandler.bind(postsController),
);
postsRouter.put(
  "/:id",
  adminGuardMiddleware,
  idValidation,
  postRequestPayloadValidation,
  inputValidationResultMiddleware,
  postsController.updatePostHandler.bind(postsController),
);
postsRouter.delete(
  "/:id",
  adminGuardMiddleware,
  idValidation,
  postsController.deletePostHandler.bind(postsController),
);
postsRouter.delete(
  "/",
  adminGuardMiddleware,
  postsController.deleteAllPostsHandler.bind(postsController),
);

postsRouter.get(
  `/:id${COMMENTS_PATH}`,
  accessTokenOptionalMiddleware,
  idValidation,
  paginationAndSortingValidation(Object.values(CommentSortField)),
  inputValidationResultMiddleware,
  postsController.getPostCommentListHandler.bind(
    postsController,
  ) as unknown as RequestHandler,
);

postsRouter.post(
  `/:id${COMMENTS_PATH}`,
  accessTokenGuardMiddleware,
  idValidation,
  postCommentRequestPayloadValidation,
  inputValidationResultMiddleware,
  postsController.createPostCommentHandler.bind(postsController),
);
