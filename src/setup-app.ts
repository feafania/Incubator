import express, { Express } from "express";
import cors from "cors";
import { setupSwagger } from "./core/swagger/setup-swagger";
import { SETTINGS } from "./core/settings/settings";
import { testingRouter } from "./features/testing/routes/testing.router";
import { postsRouter } from "./features/posts/application/posts.router";
import { blogsRouter } from "./features/blogs/application/blogs.router";
import { usersRouter } from "./features/users/routes/users.route";
import { authRouter } from "./features/auth/routes/auth.route";

/**
 * Настраиваем routes, cors, swagger
 * @param app
 */
export const setupApp = (app: Express) => {
  app.use(express.json()); // создание свойств-объектов body и query во всех реквестах
  app.use(cors()); // разрешить любым фронтам делать запросы на наш бэк

  app.get("/", (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({ version: "1.0.1" });
  });

  app.use(SETTINGS.PATH.POSTS, postsRouter);
  app.use(SETTINGS.PATH.BLOGS, blogsRouter);
  app.use(SETTINGS.PATH.USERS, usersRouter);
  app.use(SETTINGS.PATH.AUTH, authRouter);
  app.use(SETTINGS.PATH.TESTS, testingRouter);

  setupSwagger(app);

  return app;
};
