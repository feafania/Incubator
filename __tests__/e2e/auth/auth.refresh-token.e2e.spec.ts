import request from "supertest";
import { Application } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { clearDb } from "../../utils/clear-db";
import { createUserDto } from "../../utils/users/create-user-dto";
import { createUser } from "../../utils/users/create-user";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { createTestApp, stopTestDb } from "../../create-test-app";
import {
  AUTH_PATH,
  LOGIN_PATH,
  REFRESH_TOKEN_PATH,
} from "../../../src/core/paths/paths";
import { findCookie } from "../../utils/auth/extract-cookie";

describe("Auth API /auth/refresh-token", () => {
  let app: Application;
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

  it("✅ should refresh tokens when valid refreshToken is provided", async () => {
    const userData = createUserDto();
    await createUser(app, userData);

    // Login first
    const loginResponse = await request(app)
      .post(`${AUTH_PATH}${LOGIN_PATH}`)
      .send({
        loginOrEmail: userData.login,
        password: userData.password,
      })
      .expect(HTTP_STATUSES.OK_200);

    const rawCookies = loginResponse.headers["set-cookie"];
    const refreshToken = findCookie(rawCookies, "refreshToken");
    expect(refreshToken).toBeDefined();
    if (!refreshToken) {
      throw new Error("refreshToken was not found in set-cookie header");
    }

    // Refresh token
    const refreshResponse = await request(app)
      .post(`${AUTH_PATH}${REFRESH_TOKEN_PATH}`)
      .set("Cookie", refreshToken)
      .expect(HTTP_STATUSES.OK_200);

    expect(refreshResponse.body).toHaveProperty("accessToken");
    expect(refreshResponse.headers["set-cookie"]).toBeDefined();
  });

  it("❌ should return 401 when refreshToken is missing", async () => {
    await request(app)
      .post(`${AUTH_PATH}${REFRESH_TOKEN_PATH}`)
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("❌ should return 401 when refreshToken is invalid", async () => {
    await request(app)
      .post(`${AUTH_PATH}${REFRESH_TOKEN_PATH}`)
      .set("Cookie", "refreshToken=invalid-token")
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });
});
