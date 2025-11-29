import { RequestHandler, Router } from "express";
import { deleteBlogHandler } from "./http-handlers/delete-blog.handler";
import { findBlogHandler } from "./http-handlers/find-blog.handler";
import { getBlogsHandler } from "./http-handlers/get-blogs.handler";
import { createBlogHandler } from "./http-handlers/create-blog.handler";
import { updateBlogHandler } from "./http-handlers/update-blog.handler";
import { blogInputValidators, blogUpdateValidators } from "./blogs.middlewares";
import { deleteAllBlogsHandler } from "./http-handlers/delete-all-blogs.handler";
import { createBlogPostHandler } from "./http-handlers/create-blog-post.handler";
import { findBlogPostsHandler } from "./http-handlers/find-blog-posts.handler";
import { BlogSortedFields } from "../domain/blogs";
import { postRequestPayloadValidationWithoutBlogID } from "../../posts/routes/posts-request.payload.validation-middlewares";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { inputCheckErrorsMiddleware } from "../../../core/middlewares/validation/error.middleware";
import { adminGuardMiddleware } from "../../../auth/middlewares/admin-guard.middleware";
import { POSTS_PATH } from "../../../core/paths/paths";
import { PostSortField } from "../../posts/routes/request-payloads/post-sort-field";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  paginationAndSortingValidation(BlogSortedFields),
  inputCheckErrorsMiddleware,
  getBlogsHandler as any as RequestHandler,
);
blogsRouter.post(
  "/",
  adminGuardMiddleware,
  blogInputValidators,
  inputCheckErrorsMiddleware,
  createBlogHandler,
);
blogsRouter.get("/:id", findBlogHandler);
blogsRouter.put(
  "/:id",
  adminGuardMiddleware,
  blogUpdateValidators,
  inputCheckErrorsMiddleware,
  updateBlogHandler,
);
blogsRouter.delete("/:id", adminGuardMiddleware, deleteBlogHandler);
blogsRouter.delete("/", adminGuardMiddleware, deleteAllBlogsHandler);

blogsRouter.get(
  `/:id${POSTS_PATH}`,
  paginationAndSortingValidation(Object.values(PostSortField)),
  inputCheckErrorsMiddleware,
  findBlogPostsHandler as any as RequestHandler,
);

blogsRouter.post(
  `/:id${POSTS_PATH}`,
  adminGuardMiddleware,
  postRequestPayloadValidationWithoutBlogID,
  inputCheckErrorsMiddleware,
  createBlogPostHandler,
);
