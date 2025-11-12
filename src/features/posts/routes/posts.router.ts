import { RequestHandler, Router } from "express";
import { deletePostHandler } from "./http-handlers/delete-post.handler";
import { findPostHandler } from "./http-handlers/find-post.handler";
import { getPostsHandler } from "./http-handlers/get-posts.handler";
import { createPostHandler } from "./http-handlers/create-post.handler";
import { updatePostHandler } from "./http-handlers/update-post.handler";
import {
  postCommentValidators,
  postInputValidators,
} from "./posts.middlewares";
import { deleteAllPostsHandler } from "./http-handlers/delete-all-posts.handler";
import { PostSortedFields } from "../domain/posts";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { inputCheckErrorsMiddleware } from "../../../core/middlewares/validation/error.middleware";
import { adminGuardMiddleware } from "../../../auth/middlewares/admin-guard.middleware";
import { COMMENTS_PATH } from "../../../core/paths/paths";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { createPostCommentHandler } from "./http-handlers/create-post-comment.handler";
import { accessTokenGuardMiddleware } from "../../../auth/middlewares/access-token-guard.middleware";
import { CommentSortField } from "../../comments/routes/request-payloads/comment-sort-field";
import { getPostCommentListHandler } from "./http-handlers/get-post-comment-list.handler";

export const postsRouter = Router();
postsRouter.get(
  "/",
  paginationAndSortingValidation(PostSortedFields),
  inputCheckErrorsMiddleware,
  getPostsHandler as unknown as RequestHandler,
);
postsRouter.post(
  "/",
  adminGuardMiddleware,
  postInputValidators,
  inputCheckErrorsMiddleware,
  createPostHandler,
);
postsRouter.get("/:id", findPostHandler);
postsRouter.put(
  "/:id",
  adminGuardMiddleware,
  postInputValidators,
  inputCheckErrorsMiddleware,
  updatePostHandler,
);
postsRouter.delete("/:id", adminGuardMiddleware, deletePostHandler);
postsRouter.delete("/", adminGuardMiddleware, deleteAllPostsHandler);

postsRouter.get(
  `/:id${COMMENTS_PATH}`,
  paginationAndSortingValidation(Object.values(CommentSortField)),
  inputValidationResultMiddleware,
  getPostCommentListHandler,
);

postsRouter.post(
  `/:id${COMMENTS_PATH}`,
  accessTokenGuardMiddleware,
  postCommentValidators,
  inputValidationResultMiddleware,
  createPostCommentHandler,
);
