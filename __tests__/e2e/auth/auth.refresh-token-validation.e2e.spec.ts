import request from "supertest";
import { Application } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { clearDb } from "../../utils/clear-db";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { createTestApp, stopTestDb } from "../../create-test-app";
import {
  AUTH_PATH,
  REFRESH_TOKEN_PATH,
  LOGOUT_PATH,
} from "../../../src/core/paths/paths";

describe("Auth API body validation / refresh-token & logout", () => {
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

  it("❌ should return 401 if no refreshToken cookie provided for /refresh-token", async () => {
    const response = await request(app)
      .post(`${AUTH_PATH}${REFRESH_TOKEN_PATH}`)
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);

    expect(response.body).toEqual({});
  });

  it("❌ should return 401 if invalid refreshToken cookie provided for /refresh-token", async () => {
    const response = await request(app)
      .post(`${AUTH_PATH}${REFRESH_TOKEN_PATH}`)
      .set("Cookie", "refreshToken=invalid-token")
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);

    expect(response.body).toEqual({});
  });

  it("❌ should return 401 if no refreshToken cookie provided for /logout", async () => {
    const response = await request(app)
      .post(`${AUTH_PATH}${LOGOUT_PATH}`)
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);

    expect(response.body).toEqual({});
  });

  it("❌ should return 401 if invalid refreshToken cookie provided for /logout", async () => {
    const response = await request(app)
      .post(`${AUTH_PATH}${LOGOUT_PATH}`)
      .set("Cookie", "refreshToken=invalid-token")
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);

    expect(response.body).toEqual({});
  });
});
