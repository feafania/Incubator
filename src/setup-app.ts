import express, { Express } from "express";
import cors from "cors";
import { setupSwagger } from "./core/swagger/setup-swagger";
import { SETTINGS } from "./core/settings/settings";
import { testingRouter } from "./features/testing/routes/testing.router";
import { postsRouter } from "./features/posts/routes/posts.router";
import { blogsRouter } from "./features/blogs/routes/blogs.router";
import { usersRouter } from "./features/users/routes/users.route";
import { authRouter } from "./features/auth/routes/auth.route";
import { commentsRouter } from "./features/comments/routes/comments.route";
import cookieParser from "cookie-parser";
import { errorsHandler } from "./core/errors/errors.handler";
import { securityRouter } from "./features/security/routes/security.route";

/**
 * Настраиваем routes, cors, swagger
 * @param app
 */
export const setupApp = (app: Express) => {
  app.use(express.json()); // создание свойств-объектов body и query во всех реквестах
  app.use(cookieParser());
  app.use(cors()); // разрешить любым фронтам делать запросы на наш бэк

  app.get("/", (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({ version: "1.0.1" });
  });

  // app.use(rateLimitMiddleware);
  app.use(SETTINGS.PATH.POSTS, postsRouter);
  app.use(SETTINGS.PATH.BLOGS, blogsRouter);
  app.use(SETTINGS.PATH.USERS, usersRouter);
  app.use(SETTINGS.PATH.AUTH, authRouter);
  app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
  app.use(SETTINGS.PATH.TESTS, testingRouter);
  app.use(SETTINGS.PATH.SECURITY, securityRouter);

  setupSwagger(app);

  app.use((err: unknown, req: any, res: any, next: any) => {
    errorsHandler(err, res);
  });

  return app;
};
