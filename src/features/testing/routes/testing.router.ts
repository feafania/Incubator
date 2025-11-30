import { Request, Response, Router } from "express";
import { HTTP_STATUSES } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { PostsService } from "../../posts/application/posts.service";
import { BlogsService } from "../../blogs/application/blogs.service";
import { UsersService } from "../../users/application/users.service";
import { CommentsService } from "../../comments/application/comments.service";
import { AuthService } from "../../auth/application/auth.service";
import { RateLimitService } from "../../rate-limit/application/rate-limit.service";
import { SessionService } from "../../auth/application/session.service";

const postsService = container.get<PostsService>(PostsService);
const blogsService = container.get<BlogsService>(BlogsService);
const usersService = container.get<UsersService>(UsersService);
const commentsService = container.get<CommentsService>(CommentsService);
const authService = container.get<AuthService>(AuthService);
const rateLimitService = container.get<RateLimitService>(RateLimitService);
const sessionService = container.get<SessionService>(SessionService);

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
      authService.deleteMany(),
      rateLimitService.deleteMany(),
      sessionService.deleteMany(),
    ]);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (error) {
    console.log(error);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
  return;
};

testingRouter.delete("/", deleteAllData);
