import { Request, Response, Router } from "express";
import { HTTP_STATUSES } from "../../db/utils";
import blogsService from "../blogs/blogs.service";
import postsService from "../posts/posts.service";

export const testRouter = Router();

export const deleteAllData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await blogsService.deleteAllBlogs();
    await postsService.deleteAllPosts();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (error) {
    console.log(error);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
  return;
};

testRouter.delete("/", deleteAllData);
