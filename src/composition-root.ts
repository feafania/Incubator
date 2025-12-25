import "reflect-metadata";
import { Container } from "inversify";
import { SessionRepository } from "./features/auth/repositories/session.repository";
import { SessionService } from "./features/auth/application/session.service";
import { BlogQueryRepository } from "./features/blogs/repositories/blog.query.repository";
import { BlogsRepository } from "./features/blogs/repositories/blogs.repository";
import { BlogQueryService } from "./features/blogs/application/blog.query.service";
import { BlogsService } from "./features/blogs/application/blogs.service";
import { AuthQueryRepository } from "./features/auth/repositories/auth.query.repository";
import { AuthQueryService } from "./features/auth/application/auth.query.service";
import { AuthRepository } from "./features/auth/repositories/auth.repository";
import { AuthService } from "./features/auth/application/auth.service";
import { UsersRepository } from "./features/users/repositories/users.repository";
import { UsersService } from "./features/users/application/users.service";
import { PostQueryRepository } from "./features/posts/repositories/post.query.repository";
import { PostQueryService } from "./features/posts/application/post.query.service";
import { PostsRepository } from "./features/posts/repositories/posts.repository";
import { PostsService } from "./features/posts/application/posts.service";
import { SecurityQueryRepository } from "./features/security/repositories/security.query.repository";
import { SecurityQueryService } from "./features/security/application/security.query.service";
import { SecurityService } from "./features/security/application/security.service";
import { UserQueryRepository } from "./features/users/repositories/user.query.repository";
import { UserQueryService } from "./features/users/application/user.query.service";
import { RateLimitRepository } from "./features/rate-limit/repositories/rate-limit.repository";
import { RateLimitService } from "./features/rate-limit/application/rate-limit.service";
import { CommentQueryRepository } from "./features/comments/repositories/comment.query.repository";
import { CommentQueryService } from "./features/comments/application/comment.query.service";
import { CommentsRepository } from "./features/comments/repositories/comments.repository";
import { CommentsService } from "./features/comments/application/comments.service";
import { PostsController } from "./features/posts/routes/controllers/posts.controller";
import { BlogsController } from "./features/blogs/routes/controllers/blogs.controller";
import { CommentsController } from "./features/comments/routes/controllers/comments.controller";
import { SecurityController } from "./features/security/routes/controllers/security.controller";
import { UsersController } from "./features/users/routes/controllers/users.controller";
import { AuthController } from "./features/auth/routes/controllers/auth.controller";
import { LikesRepository } from "./features/likes/repositories/likes.repository";
import { LikesService } from "./features/likes/application/likes.service";

export const container = new Container();

container.bind(SessionRepository).toSelf();
container.bind(SessionService).toSelf();

container.bind(AuthQueryRepository).toSelf();
container.bind(AuthRepository).toSelf();

container.bind(AuthQueryService).toSelf();
container.bind(AuthService).toSelf();

container.bind(UserQueryRepository).toSelf();
container.bind(UsersRepository).toSelf();

container.bind(UserQueryService).toSelf();
container.bind(UsersService).toSelf();

container.bind(SecurityQueryRepository).toSelf();
container.bind(SecurityQueryService).toSelf();

container.bind(SecurityService).toSelf();

container.bind(RateLimitRepository).toSelf();
container.bind(RateLimitService).toSelf();

container.bind(BlogQueryRepository).toSelf();
container.bind(BlogsRepository).toSelf();

container.bind(BlogQueryService).toSelf();
container.bind(BlogsService).toSelf();

container.bind(PostQueryRepository).toSelf();
container.bind(PostsRepository).toSelf();

container.bind(PostQueryService).toSelf();
container.bind(PostsService).toSelf();

container.bind(CommentQueryRepository).toSelf();
container.bind(CommentsRepository).toSelf();

container.bind(CommentQueryService).toSelf();
container.bind(CommentsService).toSelf();

container.bind(LikesService).toSelf();
container.bind(LikesRepository).toSelf();

container.bind(PostsController).toSelf();
container.bind(BlogsController).toSelf();
container.bind(CommentsController).toSelf();
container.bind(SecurityController).toSelf();
container.bind(UsersController).toSelf();
container.bind(AuthController).toSelf();
