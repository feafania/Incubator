import request from "supertest";
import express from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { clearDb } from "../../utils/clear-db";
import { createUserDto } from "../../utils/users/create-user-dto";
import { createUser } from "../../utils/users/create-user";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { createTestApp, stopTestDb } from "../../create-test-app";
import { AUTH_PATH } from "../../../src/core/paths/paths";

describe("Auth API /auth/login", () => {
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

  it("✅ should return 204 for correct login", async () => {
    const userData = createUserDto();
    await createUser(app, userData);

    const response = await request(app).post(`${AUTH_PATH}/login`).send({
      loginOrEmail: userData.login,
      password: userData.password,
    });

    expect(response.status).toBe(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("❌ should return 401 for wrong login", async () => {
    const response = await request(app).post(`${AUTH_PATH}/login`).send({
      loginOrEmail: "nonexistent",
      password: "12345678",
    });

    expect(response.status).toBe(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("❌ should return 401 for wrong password", async () => {
    const userData = createUserDto();
    await createUser(app, userData);

    const response = await request(app).post(`${AUTH_PATH}/login`).send({
      loginOrEmail: userData.login,
      password: "wrongpassword",
    });

    expect(response.status).toBe(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });
});
