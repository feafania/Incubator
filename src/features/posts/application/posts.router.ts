import { RequestHandler, Router } from "express";
import { deletePostController } from "../routes/deletePostController";
import { findPostController } from "../routes/findPostController";
import { getPostsController } from "../routes/getPostsController";
import { createPostController } from "../routes/createPostController";
import { updatePostController } from "../routes/updatePostController";
import { postInputValidators } from "./middlewares";
import { deleteAllPostsData } from "../routes/deleteAllPostsData";
import { PostSortedFields } from "../domain/posts";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {
  checkAuthorization,
  inputCheckErrorsMiddleware,
} from "../../../core/middlewares/common.middlewares";

export const postsRouter = Router();
postsRouter.get(
  "/",
  paginationAndSortingValidation(PostSortedFields),
  inputCheckErrorsMiddleware,
  getPostsController as unknown as RequestHandler,
);
postsRouter.post(
  "/",
  checkAuthorization,
  postInputValidators,
  inputCheckErrorsMiddleware,
  createPostController,
);
postsRouter.get("/:id", findPostController);
postsRouter.put(
  "/:id",
  checkAuthorization,
  postInputValidators,
  inputCheckErrorsMiddleware,
  updatePostController,
);
postsRouter.delete("/:id", checkAuthorization, deletePostController);
postsRouter.delete("/", checkAuthorization, deleteAllPostsData);
