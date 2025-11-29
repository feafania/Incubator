import { RequestHandler, Router } from "express";
import { deletePostHandler } from "./http-handlers/delete-post.handler";
import { findPostHandler } from "./http-handlers/find-post.handler";
import { getPostListHandler } from "./http-handlers/get-post-list.handler";
import { createPostHandler } from "./http-handlers/create-post.handler";
import { updatePostHandler } from "./http-handlers/update-post.handler";
import {
  postCommentRequestPayloadValidation,
  postRequestPayloadValidation,
} from "./posts-request.payload.validation-middlewares";
import { deleteAllPostsHandler } from "./http-handlers/delete-all-posts.handler";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { inputCheckErrorsMiddleware } from "../../../core/middlewares/validation/error.middleware";
import { adminGuardMiddleware } from "../../../auth/middlewares/admin-guard.middleware";
import { COMMENTS_PATH } from "../../../core/paths/paths";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { createPostCommentHandler } from "./http-handlers/create-post-comment.handler";
import { accessTokenGuardMiddleware } from "../../../auth/middlewares/access-token-guard.middleware";
import { CommentSortField } from "../../comments/routes/request-payloads/comment-sort-field";
import { getPostCommentListHandler } from "./http-handlers/get-post-comment-list.handler";
import { PostSortField } from "./request-payloads/post-sort-field";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";

export const postsRouter = Router();
postsRouter.get(
  "/",
  paginationAndSortingValidation(Object.values(PostSortField)),
  inputCheckErrorsMiddleware,
  getPostListHandler as unknown as RequestHandler,
);
postsRouter.post(
  "/",
  adminGuardMiddleware,
  postRequestPayloadValidation,
  inputValidationResultMiddleware,
  createPostHandler,
);
postsRouter.get("/:id", idValidation, findPostHandler);
postsRouter.put(
  "/:id",
  adminGuardMiddleware,
  idValidation,
  postRequestPayloadValidation,
  inputValidationResultMiddleware,
  updatePostHandler,
);
postsRouter.delete(
  "/:id",
  adminGuardMiddleware,
  idValidation,
  deletePostHandler,
);
postsRouter.delete("/", adminGuardMiddleware, deleteAllPostsHandler);

postsRouter.get(
  `/:id${COMMENTS_PATH}`,
  idValidation,
  paginationAndSortingValidation(Object.values(CommentSortField)),
  inputValidationResultMiddleware,
  getPostCommentListHandler,
);

postsRouter.post(
  `/:id${COMMENTS_PATH}`,
  accessTokenGuardMiddleware,
  idValidation,
  postCommentRequestPayloadValidation,
  inputValidationResultMiddleware,
  createPostCommentHandler,
);
