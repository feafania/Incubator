import request from "supertest";
import express from "express";
import { clearDb } from "../../utils/clear-db";
import { MongoMemoryServer } from "mongodb-memory-server";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { AUTH_PATH } from "../../../src/core/paths/paths";
import { createTestApp, stopTestDb } from "../../create-test-app";

describe("Auth API body validation check /auth/login", () => {
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

  it("❌ should return 400 when loginOrEmail or password invalid", async () => {
    // Пусты loginOrEmail
    const invalidDataSet1 = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: "", // пустое поле
        password: "123456",
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errorsMessages).toBeInstanceOf(Array);
    expect(invalidDataSet1.body.errorsMessages.length).toBeGreaterThan(0);

    // Пусты password
    const invalidDataSet2 = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: "testuser",
        password: "", // пустое поле
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errorsMessages).toBeInstanceOf(Array);
    expect(invalidDataSet2.body.errorsMessages.length).toBeGreaterThan(0);

    // Абодва палі пустыя
    const invalidDataSet3 = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: "",
        password: "",
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet3.body.errorsMessages).toBeInstanceOf(Array);
    expect(invalidDataSet3.body.errorsMessages.length).toBeGreaterThanOrEqual(
      2,
    );
  });
});
