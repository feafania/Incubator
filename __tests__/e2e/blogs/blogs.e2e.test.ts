import { MongoMemoryServer } from "mongodb-memory-server";
import { SETTINGS } from "../../../src/core/settings/settings";
import {
  Blog,
  BlogDocument,
  BlogModel,
} from "../../../src/features/blogs/domain/blogs";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import CreateBlogInputModel from "../../../src/features/blogs/routes/request-payloads/create-blog-request.payload";
import { datasetBlogValid, setMongoDB } from "../../utils/datasets";
import CreatePostRequestPayload from "../../../src/features/posts/routes/request-payloads/create-post-request.payload";
import { mapToBlogOutput } from "../../../src/features/blogs/application/mappers/map-to-blog-output.util";
import { BlogDomainDto } from "../../../src/features/blogs/domain/blog-domain.dto";
import { Express } from "express";
import { createTestApp } from "../../create-test-app";
import { clearDb } from "../../utils/clear-db";
import request from "supertest";
import { ClassFieldsOnly } from "../../../src/core/types/fields-only";
import mongoose from "mongoose";

describe("tests for /blogs", () => {
  let app: Express;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Стварыць часовы сервер MongoDB
    const setup = await createTestApp();
    app = setup.app;
    mongoServer = setup.mongoServer;
    // console.log(await blogCollection.find().toArray())
    const info = await setMongoDB<ClassFieldsOnly<Blog>>(BlogModel, []);
  });

  afterAll(async () => {
    await clearDb(app);
    if (mongoServer) await mongoServer.stop({ doCleanup: true });
  });
  const bufferContent = Buffer.from(SETTINGS.ADMIN_AUTH, "utf8");
  const codedAuthorization = bufferContent.toString("base64");

  it("should get empty blogs array", async () => {
    const res = await request
      .agent(app)
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
    const info = await setMongoDB<ClassFieldsOnly<Blog>>(
      BlogModel,
      datasetBlogValid,
    );

    const res = await request
      .agent(app)
      .get(SETTINGS.PATH.BLOGS)
      .expect(HTTP_STATUSES.OK_200);

    // console.log(JSON.stringify(res.body[0]),'\n',JSON.stringify(datasetBlogValid[0]))
    // expect(res.body.length).toBe(1)
    // expect(res.body.length).toBe(datasetBlogValid.length);
    // expect(res.body[0]).toEqual(blogsService.mapToOutput(datasetBlogValid[0]));
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(datasetBlogValid.length);

    const sortedExpected = await Promise.all(
      [...datasetBlogValid]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((b) => {
          return mapToBlogOutput(b as BlogDocument);
        }),
    );

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
    const res = await request
      .agent(app)
      .post(SETTINGS.PATH.BLOGS)
      .send(newBlog) // отправка данных
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("should create", async () => {
    const res = await request
      .agent(app)
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
    const res = await request
      .agent(app)
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
    const res = await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .post(SETTINGS.PATH.BLOGS)
      .send(newWrongBlog) // отправка данных
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    console.log(res.body, res.status);
  });

  it("shouldn't find blog", async () => {
    await setMongoDB<ClassFieldsOnly<Blog>>(BlogModel, datasetBlogValid);

    const res = await request
      .agent(app)
      .get(SETTINGS.PATH.BLOGS + "/1")
      .expect(HTTP_STATUSES.NOT_FOUND_404); // проверка на ошибку

    console.log(res.body);
  });

  it("should update blog", async () => {
    const info = await setMongoDB<ClassFieldsOnly<Blog>>(
      BlogModel,
      datasetBlogValid,
    );
    const updateBlog = {
      ...datasetBlogValid[0],
      name: "Stories",
      description: "Stories about my life",
      websiteUrl: "https://www.themoviedbdfdf.org/",
    };

    const res = await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .put(SETTINGS.PATH.BLOGS + "/" + updateBlog._id)
      .send(updateBlog) // отправка данных
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("shouldn't update blog", async () => {
    const updateBlog = {
      _id: new mongoose.Types.ObjectId(),
      name: "Stories",
      description: "Stories about my life",
      websiteUrl: "https://www.themoviedbdfdf.org/",
      createdAt: new Date("2024-11-10T14:30:00Z"),
      isMembership: false,
      updatedAt: new Date("2024-11-10T14:30:00Z"),
      update(dto: BlogDomainDto) {},
    };

    const res = await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .put(SETTINGS.PATH.BLOGS + "/" + updateBlog._id)
      .send(updateBlog) // отправка данных
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should not delete blog unauthorized", async () => {
    const info = await setMongoDB<ClassFieldsOnly<Blog>>(
      BlogModel,
      datasetBlogValid,
    );

    await request
      .agent(app)
      .set("Authorization", "")
      .delete(SETTINGS.PATH.BLOGS + "/" + datasetBlogValid[1]._id)
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("should delete existing blog", async () => {
    await setMongoDB<ClassFieldsOnly<Blog>>(BlogModel, datasetBlogValid);
    const currentId = datasetBlogValid[1]._id;

    await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .delete(SETTINGS.PATH.BLOGS + "/" + currentId)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request
      .agent(app)
      .get(SETTINGS.PATH.BLOGS + "/" + currentId)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("shouldn't delete not-existing blog", async () => {
    const res = await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .delete(SETTINGS.PATH.BLOGS + "/-1")
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should delete all blogs", async () => {
    await setMongoDB<ClassFieldsOnly<Blog>>(BlogModel, datasetBlogValid);
    const res = await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .delete(SETTINGS.PATH.BLOGS)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    console.log(await BlogModel.find().lean());
  });

  it("should get empty posts array for existing blog", async () => {
    await setMongoDB<ClassFieldsOnly<Blog>>(BlogModel, [datasetBlogValid[0]]);

    const res = await request
      .agent(app)
      .get(`${SETTINGS.PATH.BLOGS}/${datasetBlogValid[0]._id}/posts`)
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
    await setMongoDB<ClassFieldsOnly<Blog>>(BlogModel, [datasetBlogValid[0]]);

    const newPost: Omit<CreatePostRequestPayload, "blogId"> = {
      title: "My first rabbit story",
      shortDescription: "How Rabbit Anty found a carrot",
      content: "It was early morning...",
    };

    const createRes = await request
      .agent(app)
      .set("Authorization", "Basic " + codedAuthorization)
      .post(`${SETTINGS.PATH.BLOGS}/${datasetBlogValid[0]._id}/posts`)
      .send(newPost)
      .expect(HTTP_STATUSES.CREATE_201);

    expect(createRes.body).toMatchObject({
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: datasetBlogValid[0]._id.toString(),
      blogName: datasetBlogValid[0].name,
    });

    const getRes = await request
      .agent(app)
      .get(`${SETTINGS.PATH.BLOGS}/${datasetBlogValid[0]._id}/posts`)
      .expect(HTTP_STATUSES.OK_200);

    expect(getRes.body).toHaveProperty("items");
    expect(getRes.body.items.length).toBe(1);
    expect(getRes.body.items[0]).toMatchObject({
      title: newPost.title,
      blogId: datasetBlogValid[0]._id.toString(),
    });

    expect(getRes.body).toMatchObject({
      page: 1,
      pageSize: 10,
      totalCount: 1,
      pagesCount: 1,
    });
  });
});
