import { datasetPostValid, setMongoDB } from "../../utils/datasets";
import { postCollection } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/core/settings/settings";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";

import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { createUserAndLogin } from "../../utils/users/create-user-and-login";
import { createTestApp, stopTestDb } from "../../create-test-app";
import request from "supertest";

describe("tests for /posts/:id/comments", () => {
  const commentContent = { content: "This is a test comment" };
  let validPostId: string;
  let token: string;

  let app: express.Express;
  let mongoServer: MongoMemoryServer;
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    const setup = await createTestApp();
    app = setup.app;
    mongoServer = setup.mongoServer;
    await setMongoDB(postCollection, datasetPostValid);
    validPostId = datasetPostValid[0]._id!.toString();
    // console.log(await postCollection.find().toArray())

    // ствараем карыстальніка і атрымліваем JWT токен
    const createdUser = await createUserAndLogin(app);
    token = createdUser.accessToken || "";
  });

  afterAll(async () => {
    await stopTestDb(mongoServer);
  });

  it("should return empty comments array for a valid post", async () => {
    const [res] = await Promise.all([
      request(app)
        .get(`${SETTINGS.PATH.POSTS}/${validPostId}/comments`)
        .expect(HTTP_STATUSES.OK_200),
    ]);

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

  it("should return 404 for non-existing post comments", async () => {
    await request(app)
      .get(`${SETTINGS.PATH.POSTS}/-1/comments`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should not create comment without auth", async () => {
    await request(app)
      .post(`${SETTINGS.PATH.POSTS}/${validPostId}/comments`)
      .send(commentContent)
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("should not create comment with invalid content", async () => {
    await request(app)
      .post(`${SETTINGS.PATH.POSTS}/${validPostId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "" })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it("should create comment with valid data", async () => {
    const res = await request(app)
      .post(`${SETTINGS.PATH.POSTS}/${validPostId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send(commentContent)
      .expect(HTTP_STATUSES.CREATE_201);

    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("content", commentContent.content);
    expect(res.body).toHaveProperty("commentatorInfo");
    expect(res.body.commentatorInfo).toHaveProperty("userId");
    expect(res.body.commentatorInfo).toHaveProperty("userLogin");
    expect(res.body).toHaveProperty("createdAt");
  });

  it("should return comments with pagination after adding", async () => {
    const res = await request(app)
      .get(
        `${SETTINGS.PATH.POSTS}/${validPostId}/comments?pageNumber=1&pageSize=10`,
      )
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body.totalCount).toBeGreaterThan(0);
    expect(res.body.items[0]).toHaveProperty("id");
    expect(res.body.items[0]).toHaveProperty("content");
  });
});
