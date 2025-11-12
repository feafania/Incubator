import request from "supertest";
import express from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { clearDb } from "../../utils/clear-db";
import { createTestApp, stopTestDb } from "../../create-test-app";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { COMMENTS_PATH } from "../../../src/core/paths/paths";
import { createUserAndLogin } from "../../utils/users/create-user-and-login";
import { ObjectId } from "mongodb";

describe("Comments API body validation check", () => {
  let app: express.Express;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    const setup = await createTestApp();
    app = setup.app;
    mongoServer = setup.mongoServer;
  });

  beforeEach(async () => {
    await clearDb(app);
  });

  afterAll(async () => {
    await stopTestDb(mongoServer);
  });

  it("❌ should return 400 when content is too short or empty", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const fakeCommentId = new ObjectId().toString();

    // Пустое поле content
    const res1 = await request(app)
      .put(`${COMMENTS_PATH}/${fakeCommentId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "" })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res1.body.errorsMessages).toBeInstanceOf(Array);
    expect(res1.body.errorsMessages[0].field).toBe("content");

    // Менш за 20 сімвалаў
    const res2 = await request(app)
      .put(`${COMMENTS_PATH}/${fakeCommentId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "too short" })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res2.body.errorsMessages).toBeInstanceOf(Array);
    expect(res2.body.errorsMessages[0].field).toBe("content");
  });

  it("❌ should return 400 when content is too long (>300 chars)", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const fakeCommentId = new ObjectId().toString();

    const longContent = "a".repeat(301);

    const response = await request(app)
      .put(`${COMMENTS_PATH}/${fakeCommentId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: longContent })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(response.body.errorsMessages).toBeInstanceOf(Array);
    expect(response.body.errorsMessages[0].field).toBe("content");
  });

  it("❌ should return 400 when content is not a string", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const fakeCommentId = new ObjectId().toString();

    const response = await request(app)
      .put(`${COMMENTS_PATH}/${fakeCommentId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: 12345 }) // не радок
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(response.body.errorsMessages).toBeInstanceOf(Array);
    expect(response.body.errorsMessages[0].field).toBe("content");
  });

  it("❌ should return 401 when no token provided", async () => {
    const fakeCommentId = new ObjectId().toString();

    await request(app)
      .put(`${COMMENTS_PATH}/${fakeCommentId}`)
      .send({ content: "This is a valid comment with enough length" })
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });
});