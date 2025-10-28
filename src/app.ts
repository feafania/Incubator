import express from "express";
import cors from "cors";
import { SETTINGS } from "./settings";
import { postsRouter } from "./features/posts/posts.router";
import { blogsRouter } from "./features/blogs/blogs.router";
import { testRouter } from "./features/test/test.router";

export const app = express(); // создать приложение
app.use(express.json()); // создание свойств-объектов body и query во всех реквестах
app.use(cors()); // разрешить любым фронтам делать запросы на наш бэк

app.get("/", (req, res) => {
  // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
  res.status(200).json({ version: "2.0" });
});

app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.TESTS, testRouter);
