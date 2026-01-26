import { RequestHandler, Router } from "express";
import {
  blogCreateRequestPayloadValidation,
  blogUpdateRequestPayloadValidation,
} from "./blogs-request.payload.validation-middlewares";
import { postRequestPayloadValidationWithoutBlogID } from "../../posts/routes/posts-request.payload.validation-middlewares";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { inputCheckErrorsMiddleware } from "../../../core/middlewares/validation/error.middleware";
import { adminGuardMiddleware } from "../../../auth/middlewares/admin-guard.middleware";
import { POSTS_PATH } from "../../../core/paths/paths";
import { PostSortField } from "../../posts/routes/request-payloads/post-sort-field";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";
import { BlogSortField } from "./request-payloads/blog-sort-field";
import { container } from "../../../composition-root";
import { BlogsController } from "./controllers/blogs.controller";
import { accessTokenOptionalMiddleware } from "../../../auth/middlewares/access-token-optional.middleware";

export const blogsRouter = Router();

const blogsController = container.get<BlogsController>(BlogsController);

blogsRouter.get(
  "/",
  paginationAndSortingValidation(Object.values(BlogSortField)),
  inputCheckErrorsMiddleware,
  blogsController.getBlogListHandler.bind(
    blogsController,
  ) as any as RequestHandler,
);
blogsRouter.post(
  "/",
  adminGuardMiddleware,
  blogCreateRequestPayloadValidation,
  inputCheckErrorsMiddleware,
  blogsController.createBlogHandler.bind(blogsController),
);
blogsRouter.get(
  "/:id",
  idValidation,
  blogsController.findBlogHandler.bind(blogsController),
);
blogsRouter.put(
  "/:id",
  adminGuardMiddleware,
  blogUpdateRequestPayloadValidation,
  inputCheckErrorsMiddleware,
  blogsController.updateBlogHandler.bind(blogsController),
);
blogsRouter.delete(
  "/:id",
  adminGuardMiddleware,
  idValidation,
  blogsController.deleteBlogHandler.bind(blogsController),
);
blogsRouter.delete(
  "/",
  adminGuardMiddleware,
  blogsController.deleteAllBlogsHandler.bind(blogsController),
);

blogsRouter.get(
  `/:id${POSTS_PATH}`,
  accessTokenOptionalMiddleware,
  paginationAndSortingValidation(Object.values(PostSortField)),
  idValidation,
  inputCheckErrorsMiddleware,
  blogsController.getBlogPostListHandler.bind(
    blogsController,
  ) as any as RequestHandler,
);

blogsRouter.post(
  `/:id${POSTS_PATH}`,
  adminGuardMiddleware,
  idValidation,
  postRequestPayloadValidationWithoutBlogID,
  inputCheckErrorsMiddleware,
  blogsController.createBlogPostListHandler.bind(blogsController),
);
