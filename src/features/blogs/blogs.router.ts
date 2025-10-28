import { RequestHandler, Router } from "express";
import { deleteBlogController } from "./routes/deleteBlogController";
import { findBlogController } from "./routes/findBlogController";
import { getBlogsController } from "./routes/getBlogsController";
import { createBlogController } from "./routes/createBlogController";
import { updateBlogController } from "./routes/updateBlogController";
import { blogInputValidators, blogUpdateValidators } from "./middlewares";
import {
  checkAuthorization,
  inputCheckErrorsMiddleware,
  paginationAndSortingValidation,
} from "../common.middlewares";
import { deleteAllBlogsData } from "./routes/deleteAllBlogsData";
import { BlogSortedFields, PostSortedFields } from "../../db/types";
import { postInputValidatorsWithoutBlogID } from "../posts/middlewares";
import { createBlogPostController } from "./routes/createBlogPostController";
import { findBlogPostsController } from "./routes/findBlogPostsController";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  paginationAndSortingValidation(BlogSortedFields),
  inputCheckErrorsMiddleware,
  getBlogsController as any as RequestHandler,
);
blogsRouter.post(
  "/",
  checkAuthorization,
  blogInputValidators,
  inputCheckErrorsMiddleware,
  createBlogController,
);
blogsRouter.get("/:id", findBlogController);
blogsRouter.put(
  "/:id",
  checkAuthorization,
  blogUpdateValidators,
  inputCheckErrorsMiddleware,
  updateBlogController,
);
blogsRouter.delete("/:id", checkAuthorization, deleteBlogController);
blogsRouter.delete("/", checkAuthorization, deleteAllBlogsData);

blogsRouter.get(
  "/:id/posts",
  paginationAndSortingValidation(PostSortedFields),
  inputCheckErrorsMiddleware,
  findBlogPostsController as any as RequestHandler,
);

blogsRouter.post(
  "/:id/posts",
  checkAuthorization,
  postInputValidatorsWithoutBlogID,
  inputCheckErrorsMiddleware,
  createBlogPostController,
);
