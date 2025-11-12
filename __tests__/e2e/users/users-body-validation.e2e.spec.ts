import request from "supertest";
import express from "express";
import { clearDb } from "../../utils/clear-db";
import { MongoMemoryServer } from "mongodb-memory-server";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { CreateUserRequestPayload } from "../../../src/features/users/routes/request-payloads/create-user-request.payload";
import { createUserDto } from "../../utils/users/create-user-dto";
import { CreateUserDomainDto } from "../../../src/features/users/domain/create-user-domain.dto";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { createTestApp, stopTestDb } from "../../create-test-app";

describe("Users API body validation check", () => {
  let app: express.Express;
  let mongoServer: MongoMemoryServer;
  const adminToken = generateBasicAuthToken();

  const correctTestUserAttributes: CreateUserDomainDto = createUserDto();

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

  it(`❌ should not create user when incorrect body passed; POST /users'`, async () => {
    const correctTestUserData: CreateUserRequestPayload = {
      ...correctTestUserAttributes,
    };

    await request(app)
      .post(USERS_PATH)
      .send(correctTestUserData)
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);

    const invalidDataSet1 = await request(app)
      .post(USERS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send({
        ...correctTestUserData,
        login: "   ", // empty string
        email: "invalid email", // incorrect email
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(2);

    const invalidDataSet2 = await request(app)
      .post(USERS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send({
        ...correctTestUserData,
        login: "Feodor",
        password: "", // empty string
        email: "feodor@example.com",
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);

    // check что никто не создался
    const userListResponse = await request(app)
      .get(USERS_PATH)
      .set("Authorization", adminToken);
    console.log("userListResponse.body", userListResponse.body);
    expect(userListResponse.body.items).toHaveLength(0);
  });
});
