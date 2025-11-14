import request from "supertest";
import express from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { clearDb } from "../../utils/clear-db";
import { createUserAndLogin } from "../../utils/users/create-user-and-login";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { AUTH_PATH, ME_PATH } from "../../../src/core/paths/paths";
import { createTestApp, stopTestDb } from "../../create-test-app";

describe("Auth API /auth/me", () => {
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

  it("✅ should return 200 and user info for valid token", async () => {
    // 1️⃣ Стварыць карыстальніка і атрымаць токен
    const { user, accessToken } = await createUserAndLogin(app);

    // 2️⃣ Запыт на /auth/me з токенам
    const response = await request(app)
      .get(`${AUTH_PATH}${ME_PATH}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HTTP_STATUSES.OK_200);

    // 3️⃣ Праверка, што вяртаюцца правільныя дадзеныя
    expect(response.body).toEqual({
      email: user.email,
      login: user.login,
      userId: user.id,
    });
  });

  it("❌ should return 401 for missing token", async () => {
    await request(app)
      .get(`${AUTH_PATH}${ME_PATH}`)
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("❌ should return 401 for invalid token", async () => {
    await request(app)
      .get(`${AUTH_PATH}${ME_PATH}`)
      .set("Authorization", "Bearer invalid.token.here")
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });
});
