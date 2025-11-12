import request from "supertest";
import express from "express";
import { clearDb } from "../../utils/clear-db";
import { MongoMemoryServer } from "mongodb-memory-server";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { AUTH_PATH, REGISTRATION_PATH } from "../../../src/core/paths/paths";
import { createTestApp, stopTestDb } from "../../create-test-app";

describe("Auth API body validation check /auth/registration", () => {
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

  it("❌ should return 400 when registration body is invalid", async () => {
    // login < 3 chars
    const invalidLogin = await request(app)
      .post(`${AUTH_PATH}${REGISTRATION_PATH.registration}`)
      .send({
        login: "ab",
        password: "validPass1",
        email: "valid@example.com",
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidLogin.body.errorsMessages).toBeInstanceOf(Array);
    expect(
      invalidLogin.body.errorsMessages.some(
        (e: { message: string; field: string }) => e.field === "login",
      ),
    ).toBe(true);

    // password < 6 chars
    const invalidPassword = await request(app)
      .post(`${AUTH_PATH}${REGISTRATION_PATH.registration}`)
      .send({
        login: "validLogin",
        password: "123",
        email: "valid@example.com",
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidPassword.body.errorsMessages).toBeInstanceOf(Array);
    expect(
      invalidPassword.body.errorsMessages.some(
        (e: { message: string; field: string }) => e.field === "password",
      ),
    ).toBe(true);

    // invalid email
    const invalidEmail = await request(app)
      .post(`${AUTH_PATH}${REGISTRATION_PATH.registration}`)
      .send({
        login: "validLogin",
        password: "validPass1",
        email: "invalid-email",
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidEmail.body.errorsMessages).toBeInstanceOf(Array);
    expect(
      invalidEmail.body.errorsMessages.some(
        (e: { message: string; field: string }) => e.field === "email",
      ),
    ).toBe(true);

    // empty body
    const emptyBody = await request(app)
      .post(`${AUTH_PATH}${REGISTRATION_PATH.registration}`)
      .send({})
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(emptyBody.body.errorsMessages).toBeInstanceOf(Array);
    expect(emptyBody.body.errorsMessages.length).toBeGreaterThanOrEqual(3);
  });
});
