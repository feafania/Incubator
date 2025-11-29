import { RequestHandler, Router } from "express";
import { deleteBlogHandler } from "./http-handlers/delete-blog.handler";
import { findBlogHandler } from "./http-handlers/find-blog.handler";
import { getBlogListHandler } from "./http-handlers/get-blog-list.handler";
import { createBlogHandler } from "./http-handlers/create-blog.handler";
import { updateBlogHandler } from "./http-handlers/update-blog.handler";
import {
  blogCreateRequestPayloadValidation,
  blogUpdateRequestPayloadValidation,
} from "./blogs-request.payload.validation-middlewares";
import { deleteAllBlogsHandler } from "./http-handlers/delete-all-blogs.handler";
import { createBlogPostListHandler } from "./http-handlers/create-blog-post-list.handler";
import { getBlogPostListHandler } from "./http-handlers/get-blog-post-list.handler";
import { postRequestPayloadValidationWithoutBlogID } from "../../posts/routes/posts-request.payload.validation-middlewares";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { inputCheckErrorsMiddleware } from "../../../core/middlewares/validation/error.middleware";
import { adminGuardMiddleware } from "../../../auth/middlewares/admin-guard.middleware";
import { POSTS_PATH } from "../../../core/paths/paths";
import { PostSortField } from "../../posts/routes/request-payloads/post-sort-field";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";
import { BlogSortField } from "./request-payloads/blog-sort-field";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  paginationAndSortingValidation(Object.values(BlogSortField)),
  inputCheckErrorsMiddleware,
  getBlogListHandler as any as RequestHandler,
);
blogsRouter.post(
  "/",
  adminGuardMiddleware,
  blogCreateRequestPayloadValidation,
  inputCheckErrorsMiddleware,
  createBlogHandler,
);
blogsRouter.get("/:id", idValidation, findBlogHandler);
blogsRouter.put(
  "/:id",
  adminGuardMiddleware,
  blogUpdateRequestPayloadValidation,
  inputCheckErrorsMiddleware,
  updateBlogHandler,
);
blogsRouter.delete(
  "/:id",
  adminGuardMiddleware,
  idValidation,
  deleteBlogHandler,
);
blogsRouter.delete("/", adminGuardMiddleware, deleteAllBlogsHandler);

blogsRouter.get(
  `/:id${POSTS_PATH}`,
  paginationAndSortingValidation(Object.values(PostSortField)),
  idValidation,
  inputCheckErrorsMiddleware,
  getBlogPostListHandler as any as RequestHandler,
);

blogsRouter.post(
  `/:id${POSTS_PATH}`,
  adminGuardMiddleware,
  idValidation,
  postRequestPayloadValidationWithoutBlogID,
  inputCheckErrorsMiddleware,
  createBlogPostListHandler,
);
