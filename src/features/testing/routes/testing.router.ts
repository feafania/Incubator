import { Request, Response, Router } from "express";
import { HTTP_STATUSES } from "../../../core/types/http-statuses";
import postsService from "../../posts/application/posts.service";
import blogsService from "../../blogs/application/blogs.service";
import usersService from "../../users/application/users.service";
import commentsService from "../../comments/application/comments.service";

export const testingRouter = Router();

export const deleteAllData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await Promise.all([
      blogsService.deleteMany(),
      postsService.deleteMany(),
      usersService.deleteMany(),
      commentsService.deleteMany(),
    ]);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (error) {
    console.log(error);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
  return;
};

testingRouter.delete("/", deleteAllData);
