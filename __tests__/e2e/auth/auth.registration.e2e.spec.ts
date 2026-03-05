import request from "supertest";
import { Application } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { clearDb } from "../../utils/clear-db";
import { createUserWithConfirmationCode } from "../../utils/users/create-user-with-confirmation-code";
import { createUserDto } from "../../utils/users/create-user-dto";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { createTestApp, stopTestDb } from "../../create-test-app";
import { AUTH_PATH, REGISTRATION_PATH } from "../../../src/core/paths/paths";
import { UsersRepository } from "../../../src/features/users/repositories/users.repository";

describe("Auth API /auth/registration", () => {
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

  it("✅ should register a new user and return 204", async () => {
    const userData = createUserDto();

    const response = await request(app)
      .post(`${AUTH_PATH}${REGISTRATION_PATH.registration}`)
      .send(userData);

    expect(response.status).toBe(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("❌ should fail registration with invalid email", async () => {
    const invalidUser = { ...createUserDto(), email: "invalidemail" };

    const response = await request(app)
      .post(`${AUTH_PATH}${REGISTRATION_PATH.registration}`)
      .send(invalidUser);

    expect(response.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "email" })]),
    );
  });

  it("✅ should resend confirmation email for unconfirmed user", async () => {
    const createdUser = await createUserWithConfirmationCode(app);
    console.log(createdUser);
    if (!createdUser) throw new Error("Error creating user");

    const response = await request(app)
      .post(`${AUTH_PATH}${REGISTRATION_PATH.registrationEmailResending}`)
      .send({ email: createdUser.email });

    expect(response.status).toBe(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("❌ should fail resending confirmation email if email not registered", async () => {
    const response = await request(app)
      .post(`${AUTH_PATH}${REGISTRATION_PATH.registrationEmailResending}`)
      .send({ email: "nonexistent@example.com" });

    expect(response.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "email" })]),
    );
  });

  it("✅ should confirm registration with valid code", async () => {
    const createdUser = await createUserWithConfirmationCode(app);
    console.log(createdUser);
    if (!createdUser) throw new Error("Error creating user");

    const confirmationCode = createdUser.emailConfirmation?.confirmationCode;

    const response = await request(app)
      .post(`${AUTH_PATH}${REGISTRATION_PATH.registrationConfirmation}`)
      .send({ code: confirmationCode });

    expect(response.status).toBe(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("❌ should fail confirmation with invalid code", async () => {
    const response = await request(app)
      .post(`${AUTH_PATH}${REGISTRATION_PATH.registrationConfirmation}`)
      .send({ code: "invalid-code" });

    expect(response.status).toBe(HTTP_STATUSES.BAD_REQUEST_400);
    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "code" })]),
    );
  });
});
