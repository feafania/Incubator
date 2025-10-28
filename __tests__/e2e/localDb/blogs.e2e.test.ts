import { app } from "../../../src/app";
import { SETTINGS } from "../../../src/settings";
import { HTTP_STATUSES, setDB } from "../../../src/db/utils";
import { config } from "dotenv";
import { BlogDBType } from "../../../src/db/types";
import { db } from "../../../src/db/db";

import {datasetBlogValid} from "../datasets";
// import * as request from 'supertest';
import request from "supertest";
import blogsService from "../../../src/features/blogs/blogs.service";
import CreateBlogInputModel from "../../../src/features/blogs/modeles/CreateModels";
import {blogCollection} from "../../../src/db/mongo-db";
import CreatePostInputModel from "../../../src/features/posts/modeles/CreateModels";

const agent = request.agent(app); //для захаваньня сэссый паміж запытамі, іначай  request(app)

config(); // добавление переменных из файла .env в process.env
console.log(process.env.NODE_ENV);

describe("tests for /blogs", () => {
  const bufferContent = Buffer.from(SETTINGS.ADMIN_AUTH, "utf8");
  const codedAuthorization = bufferContent.toString("base64");

  beforeAll(async () => {
    setDB("blogs");
  });

  it("should get empty blogs array", async () => {
    const res = await agent
      .get(SETTINGS.PATH.BLOGS)
      .expect(HTTP_STATUSES.OK_200);

    console.log(res.body);
    // expect(res.body.length).toBe(0);
    expect(res.body).toMatchObject({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
    });

    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(0);
  });

  it("should get not empty blogs array", async () => {
    setDB("blogs", datasetBlogValid); // заполнение базы данных начальными данными если нужно

    const res = await agent
      .get(SETTINGS.PATH.BLOGS)
      .expect(HTTP_STATUSES.OK_200);

    // console.log(JSON.stringify(res.body[0]),'\n',JSON.stringify(datasetBlogValid[0]))
    // expect(res.body.length).toBe(1)
    // expect(res.body.length).toBe(datasetBlogValid.length);
    // expect(res.body[0]).toEqual(blogsService.mapToOutput(datasetBlogValid[0]));
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(datasetBlogValid.length);

    const sortedExpected = [...datasetBlogValid]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((b) => blogsService.mapToOutput(b));

    expect(res.body.items).toEqual(sortedExpected);

    expect(res.body).toMatchObject({
      page: 1,
      pageSize: 10,
      totalCount: datasetBlogValid.length,
    });
  });

  const newBlog: CreateBlogInputModel = {
    name: "Animals",
    description: "All you want to know...",
    websiteUrl: "https://www.themoviedb.org/",
  };

  it("shouldn't create blogs without authorization", async () => {
    const res = await agent
      .post(SETTINGS.PATH.BLOGS)
      .send(newBlog) // отправка данных
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("should create", async () => {
    const res = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .post(SETTINGS.PATH.BLOGS)
      .send(newBlog) // отправка данных
      .expect(HTTP_STATUSES.CREATE_201);

    console.log(res.body);

    expect(res.body.description).toEqual(newBlog.description);
  });

  it("shouldn't create blog with wrong name", async () => {
    const newWrongBlog: CreateBlogInputModel = {
      name: "",
      description: "All you want to know...",
      websiteUrl: "https://www.themoviedb1.org/",
    };
    const res = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .post(SETTINGS.PATH.BLOGS)
      .send(newWrongBlog) // отправка данных
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    console.log(res.body, res.status);
  });

  it("shouldn't create blog with wrong URL", async () => {
    const newWrongBlog: CreateBlogInputModel = {
      name: "fsfsdf",
      description: "All you want to know...",
      websiteUrl: "5777https://www.themoviedb1.org/",
    };
    const res = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .post(SETTINGS.PATH.BLOGS)
      .send(newWrongBlog) // отправка данных
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    console.log(res.body, res.status);
  });

  it("shouldn't find blog", async () => {
    setDB("blogs", datasetBlogValid);

    const res = await agent
      .get(SETTINGS.PATH.BLOGS + "/1")
      .expect(HTTP_STATUSES.NOT_FOUND_404); // проверка на ошибку

    console.log(res.body);
  });

  it("should update blog", async () => {
    setDB("blogs", datasetBlogValid);
    const updateBlog: BlogDBType = {
      ...datasetBlogValid[0],
      name: "Stories",
      description: "Stories about my life",
      websiteUrl: "https://www.themoviedbdfdf.org/",
    };

    const res = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .put(SETTINGS.PATH.BLOGS + "/" + updateBlog.id)
      .send(updateBlog) // отправка данных
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("shouldn't update blog", async () => {
    const updateBlog: BlogDBType = {
      id: -1,
      name: "Stories",
      description: "Stories about my life",
      websiteUrl: "https://www.themoviedbdfdf.org/",
      createdAt: new Date("2024-11-10T14:30:00Z"),
      isMembership: false,
    };

    const res = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .put(SETTINGS.PATH.BLOGS + "/" + updateBlog.id)
      .send(updateBlog) // отправка данных
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should not delete blog unauthorized", async () => {
    setDB("blogs", datasetBlogValid);

    await agent
      .set("Authorization", "")
      .delete(SETTINGS.PATH.BLOGS + "/" + datasetBlogValid[1].id)
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("should delete existing blog", async () => {
    setDB("blogs", datasetBlogValid);
    const currentId = datasetBlogValid[1].id;

    await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .delete(SETTINGS.PATH.BLOGS + "/" + currentId)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await agent
      .get(SETTINGS.PATH.BLOGS + "/" + currentId)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("shouldn't delete not-existing blog", async () => {
    const res = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .delete(SETTINGS.PATH.BLOGS + "/-1")
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should delete all blogs", async () => {
    setDB("blogs", datasetBlogValid);
    const res = await agent
      .delete(SETTINGS.PATH.BLOGS)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    console.log("after delete", db.blogs, res.status);
  });
  it("should get empty posts array for existing blog", async () => {
    await setDB("blogs", [datasetBlogValid[0]]);

    const res = await agent
      .get(`${SETTINGS.PATH.BLOGS}/${datasetBlogValid[0].id}/posts`)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body).toMatchObject({
      page: 1,
      pageSize: 10,
      totalCount: 0,
      pagesCount: 0,
    });

    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(0);
  });

  it("should create and get posts for specific blog", async () => {
    await setDB("blogs", [datasetBlogValid[0]]);

    const newPost: CreatePostInputModel = {
      title: "My first rabbit story",
      shortDescription: "How Rabbit Anty found a carrot",
      content: "It was early morning...",
    };

    const createRes = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .post(`${SETTINGS.PATH.BLOGS}/${datasetBlogValid[0].id}/posts`)
      .send(newPost)
      .expect(HTTP_STATUSES.CREATE_201);

    expect(createRes.body).toMatchObject({
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: datasetBlogValid[0].id.toString(),
      blogName: datasetBlogValid[0].name,
    });

    const getRes = await agent
      .get(`${SETTINGS.PATH.BLOGS}/${datasetBlogValid[0].id}/posts`)
      .expect(HTTP_STATUSES.OK_200);

    expect(getRes.body).toHaveProperty("items");
    expect(getRes.body.items.length).toBe(1);
    expect(getRes.body.items[0]).toMatchObject({
      title: newPost.title,
      blogId: datasetBlogValid[0].id.toString(),
    });

    expect(getRes.body).toMatchObject({
      page: 1,
      pageSize: 10,
      totalCount: 1,
      pagesCount: 1,
    });
  });
});
