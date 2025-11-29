import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { SETTINGS } from "../../../src/core/settings/settings";
import {
  blogCollection,
  client,
  postCollection,
  runDB,
} from "../../../src/db/mongo.db";
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
import { Post } from "../../../src/features/posts/domain/posts";
import { createApp } from "../../create-app";
import { mapToPostOutput } from "../../../src/features/posts/application/mappers/map-to-post-output.util";
import { ObjectId, WithId } from "mongodb";
import { PostDomainDto } from "../../../src/features/posts/domain/post-domain.dto";

const agent = request.agent(createApp()); // для захаваньня сэссый паміж запытамі, іначай  request(app)
let mongoServer: MongoMemoryServer; // Общий сервер для всех тестов

// // работа с ид
// new ObjectId(req.params.id)
// createdInfo.id.toString()

describe("tests for /posts", () => {
  beforeAll(async () => {
    // Стварыць часовы сервер MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    // process.env.MONGO_URI = uri;

    // Падключэнне да часовага MongoDB
    await runDB(uri);
    // console.log(await postCollection.find().toArray())
    const info = await setMongoDB(postCollection, []);
  });

  afterAll(async () => {
    if (client) await client.close(); // Закрыць MongoClient
    if (mongoServer) await mongoServer.stop({ doCleanup: true });
  });

  const bufferContent = Buffer.from(SETTINGS.ADMIN_AUTH, "utf8");
  const codedAuthorization = bufferContent.toString("base64");

  it("should get empty posts array", async () => {
    const res = await agent
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
    await setMongoDB(postCollection, datasetPostValid); // заполнение базы данных начальными данными если нужно
    const res = await agent
      .get(SETTINGS.PATH.POSTS)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(datasetPostValid.length);

    const sortedExpected = await Promise.all(
      [...datasetPostValid]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((b) => {
          return mapToPostOutput(b as WithId<Post> & { blogName: string });
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
    const res = await agent
      .post(SETTINGS.PATH.POSTS)
      .send(newPost) // отправка данных
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
    console.log(res.body, res.status);
  });

  it("should create", async () => {
    await setMongoDB(blogCollection, datasetBlogValid);
    const res = await agent
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
    const res = await agent
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
    const res = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .post(SETTINGS.PATH.POSTS)
      .send(newWrongPost) // отправка данных
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    console.log(res.body, res.status);
  });

  it("shouldn't find post", async () => {
    await setMongoDB(postCollection, datasetPostValid);

    const res = await agent
      .get(SETTINGS.PATH.POSTS + "/1")
      .expect(HTTP_STATUSES.NOT_FOUND_404); // проверка на ошибку

    console.log(res.body);
  });

  it("should update post", async () => {
    await setMongoDB(blogCollection, datasetBlogValid);
    await setMongoDB(postCollection, datasetPostValid);

    const updatePost: Post = {
      ...datasetPostValid[0],
      title: "Stories",
      shortDescription: "Stories about my life",
      content: "about stories",
    };
    const res = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .put(SETTINGS.PATH.POSTS + "/" + updatePost._id)
      .send(updatePost) // отправка данных
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("shouldn't update post", async () => {
    await setMongoDB(blogCollection, datasetBlogValid);
    const updatePost: Post = {
      _id: new ObjectId(),
      title: "Stories",
      shortDescription: "Stories about my life",
      content: "about stories",
      blogId: blog1._id.toString(),
      createdAt: new Date("2024-11-10T14:30:00Z"),
      updatedAt: new Date("2024-11-10T14:30:00Z"),
      update(dto: PostDomainDto) {},
    };

    const res = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .put(SETTINGS.PATH.POSTS + "/" + updatePost._id)
      .send(updatePost) // отправка данных
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("shouldn't update post with wrong title", async () => {
    await setMongoDB(blogCollection, datasetBlogValid);
    await setMongoDB(postCollection, datasetPostValid);
    const updatePost: Post = {
      _id: post1._id,
      title: "Stories dfsdfsk dsfsfs sdfsfsf fdsfsd dsfsfs",
      shortDescription: "Stories about my life",
      content: "about stories",
      blogId: blog1._id.toString(),
      createdAt: new Date("2024-11-10T14:30:00Z"),
      updatedAt: new Date("2024-11-10T14:30:00Z"),
      update(dto: PostDomainDto) {},
    };

    const res = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .put(SETTINGS.PATH.POSTS + "/" + updatePost._id)
      .send(updatePost) // отправка данных
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it("should not delete post unauthorized", async () => {
    await setMongoDB(postCollection, datasetPostValid);

    await agent
      .set("Authorization", "")
      .delete(SETTINGS.PATH.POSTS + "/" + datasetPostValid[1]._id)
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("should delete existing post", async () => {
    await setMongoDB(postCollection, datasetPostValid);
    const currentId = datasetPostValid[1]._id;
    await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .delete(SETTINGS.PATH.POSTS + "/" + currentId)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await agent
      .get(SETTINGS.PATH.POSTS + "/" + currentId)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("shouldn't delete not-existing post", async () => {
    const res = await agent
      .set("Authorization", "Basic " + codedAuthorization)
      .delete(SETTINGS.PATH.POSTS + "/-1")
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should delete all posts", async () => {
    await setMongoDB(postCollection, datasetPostValid);
    const res = await agent
      .delete(SETTINGS.PATH.POSTS)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    console.log(await postCollection.find().toArray());
  });
});
