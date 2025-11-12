import request from "supertest";
import express from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { clearDb } from "../../utils/clear-db";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { createUserDto } from "../../utils/users/create-user-dto";
import { createUser } from "../../utils/users/create-user";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { createTestApp, stopTestDb } from "../../create-test-app";

describe("User API", () => {
  let app: express.Express;
  let mongoServer: MongoMemoryServer;
  const adminToken = generateBasicAuthToken();

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

  it("✅ should create user; POST /users", async () => {
    const response = await createUser(app, {
      ...createUserDto(),
      login: "Feodor",
      email: "feodor@example.com",
    });

    console.log("created user id:", response.id);
  });

  it("✅ should return users list; GET /users", async () => {
    await Promise.all([createUser(app), createUser(app)]);

    const response = await request(app)
      .get(USERS_PATH)
      .set("Authorization", adminToken)
      .expect(HTTP_STATUSES.OK_200);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should delete user and check after "NOT FOUND"; DELETE /users/:id', async () => {
    const createdUser = await createUser(app);
    const createdUserId = createdUser.id;

    await request(app)
      .delete(`${USERS_PATH}/${createdUserId}`)
      .set("Authorization", adminToken)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${USERS_PATH}/${createdUserId}`)
      .set("Authorization", adminToken)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
