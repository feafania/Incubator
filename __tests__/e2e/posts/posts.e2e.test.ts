import { MongoMemoryServer } from "mongodb-memory-server";
import { SETTINGS } from "../../../src/core/settings/settings";
import {
  blog1,
  datasetBlogValid,
  datasetPostValid,
  post1,
  post7,
  setMongoDB,
} from "../../utils/datasets";
import CreatePostInputModel from "../../../src/features/posts/routes/request-payloads/create-post-request.payload";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import {
  Post,
  PostModel,
} from "../../../src/features/posts/domain/posts";
import { Express } from "express";
import { createTestApp } from "../../create-test-app";
import { ClassFieldsOnly } from "../../../src/core/types/fields-only";
import { clearDb } from "../../utils/clear-db";
import request from "supertest";
import { Blog, BlogModel } from "../../../src/features/blogs/domain/blogs";
import mongoose from "mongoose";
import { testMapToPostOutput } from "../../utils/posts/map-to-post-output";

// // работа с ид
// new ObjectId(req.params.id)
// createdInfo.id.toString()

describe("tests for /posts", () => {
  let app: Express;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Стварыць часовы сервер MongoDB
    const setup = await createTestApp();
    app = setup.app;
    mongoServer = setup.mongoServer;
    // console.log(await postCollection.find().toArray())
    setMongoDB<ClassFieldsOnly<Post>>(PostModel, []);
  });

  afterAll(async () => {
    await clearDb(app);
    if (mongoServer) await mongoServer.stop({ doCleanup: true });
  });

  const bufferContent = Buffer.from(SETTINGS.ADMIN_AUTH, "utf8");
  const codedAuthorization = bufferContent.toString("base64");

  it("should get empty posts array", async () => {
    const res = await request
      .agent(app)
      .get(SETTINGS.PATH.POSTS)
      .expect(HTTP_STATUSES.OK_200);

    console.log(res.body);
    // expect(res.body.length).toBe(0);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(0);
    expect(res.body).toMatchObject({
      page: 1,
      pageSize: 10,
      totalCount: 0,
      pagesCount: 0,
    });
  });

  it("should get not empty posts array", async () => {
    await setMongoDB<ClassFieldsOnly<Post>>(PostModel, datasetPostValid); // заполнение базы данных начальными данными если нужно
    const res = await request
      .agent(app)
      .get(SETTINGS.PATH.POSTS)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(datasetPostValid.length);

    const sortedExpected = await Promise.all(
      [...datasetPostValid]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((b) => {
          return testMapToPostOutput(b);
        }),
    );
    expect(res.body.items).toEqual(sortedExpected);

    expect(res.body).toMatchObject({
      page: 1,
      pageSize: 10,
      totalCount: datasetPostValid.length,
    });
  });

  const newPost: CreatePostInputModel = {
    title: "Animals",
    shortDescription: "All you want to know...",
    content: "About everything",
    blogId: blog1._id.toString(),
  };

  it("shouldn't create posts without authorization", async () => {
    const res = await request
      .agent(app)
      .post(SETTINGS.PATH.POSTS)
      .send(newPost) // отправка данных
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
    console.log(res.body, res.status);
  });

  it("should create", async () => {
    await setMongoDB<ClassFieldsOnly<Blog>>(BlogModel, datasetBlogValid);
    const res = await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .post(SETTINGS.PATH.POSTS)
      .send(newPost) // отправка данных
      .expect(HTTP_STATUSES.CREATE_201);

    console.log(res.body);

    expect(res.body.shortDescription).toEqual(newPost.shortDescription);
  });

  it("shouldn't create post with wrong title", async () => {
    const newWrongPost: CreatePostInputModel = {
      title: "",
      shortDescription: "All you want to know...",
      content: "About everything",
      blogId: blog1._id.toString(),
    };
    const res = await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .post(SETTINGS.PATH.POSTS)
      .send(newWrongPost) // отправка данных
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    console.log(res.body, res.status);
  });

  it("shouldn't create post with wrong description", async () => {
    const newWrongPost: CreatePostInputModel = {
      title: post7.title,
      shortDescription: post7.shortDescription,
      content: post7.content,
      blogId: post7.blogId,
    };
    const res = await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .post(SETTINGS.PATH.POSTS)
      .send(newWrongPost) // отправка данных
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    console.log(res.body, res.status);
  });

  it("shouldn't find post", async () => {
    await setMongoDB<ClassFieldsOnly<Post>>(PostModel, datasetPostValid);

    const res = await request
      .agent(app)
      .get(SETTINGS.PATH.POSTS + "/1")
      .expect(HTTP_STATUSES.NOT_FOUND_404); // проверка на ошибку

    console.log(res.body);
  });

  it("should update post", async () => {
    await setMongoDB<ClassFieldsOnly<Blog>>(BlogModel, datasetBlogValid);
    await setMongoDB<ClassFieldsOnly<Post>>(PostModel, datasetPostValid);

    const updatePost = {
      ...datasetPostValid[0],
      title: "Stories",
      shortDescription: "Stories about my life",
      content: "about stories",
    };
    await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .put(SETTINGS.PATH.POSTS + "/" + updatePost._id)
      .send(updatePost) // отправка данных
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("shouldn't update post", async () => {
    await setMongoDB<ClassFieldsOnly<Blog>>(BlogModel, datasetBlogValid);
    const updatePost = {
      _id: new mongoose.Types.ObjectId(),
      title: "Stories",
      shortDescription: "Stories about my life",
      content: "about stories",
      blogId: blog1._id.toString(),
      createdAt: new Date("2024-11-10T14:30:00Z"),
      updatedAt: new Date("2024-11-10T14:30:00Z"),
      update() {},
    };

    await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .put(SETTINGS.PATH.POSTS + "/" + updatePost._id)
      .send(updatePost) // отправка данных
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("shouldn't update post with wrong title", async () => {
    await setMongoDB<ClassFieldsOnly<Blog>>(BlogModel, datasetBlogValid);
    await setMongoDB<ClassFieldsOnly<Post>>(PostModel, datasetPostValid);
    const updatePost = {
      _id: post1._id,
      title: "Stories stories stories stories stories stories",
      shortDescription: "Stories about my life",
      content: "about stories",
      blogId: blog1._id.toString(),
      createdAt: new Date("2024-11-10T14:30:00Z"),
      updatedAt: new Date("2024-11-10T14:30:00Z"),
      update() {},
    };

    await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .put(SETTINGS.PATH.POSTS + "/" + updatePost._id)
      .send(updatePost) // отправка данных
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it("should not delete post unauthorized", async () => {
    await setMongoDB<ClassFieldsOnly<Post>>(PostModel, datasetPostValid);

    await request
      .agent(app)
      .set("Authorization", "")
      .delete(SETTINGS.PATH.POSTS + "/" + datasetPostValid[1]._id)
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("should delete existing post", async () => {
    await setMongoDB<ClassFieldsOnly<Post>>(PostModel, datasetPostValid);
    const currentId = datasetPostValid[1]._id;
    await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .delete(SETTINGS.PATH.POSTS + "/" + currentId)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request
      .agent(app)
      .get(SETTINGS.PATH.POSTS + "/" + currentId)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("shouldn't delete not-existing post", async () => {
    await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .delete(SETTINGS.PATH.POSTS + "/-1")
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should delete all posts", async () => {
    await setMongoDB<ClassFieldsOnly<Post>>(PostModel, datasetPostValid);
    await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .delete(SETTINGS.PATH.POSTS)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    console.log(await PostModel.find().lean());
  });
});
