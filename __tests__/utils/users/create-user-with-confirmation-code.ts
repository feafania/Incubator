import request from "supertest";
import { CreateUserRequestPayload } from "../../../src/features/users/routes/request-payloads/create-user-request.payload";
import { CreateUserDomainDto } from "../../../src/features/users/domain/create-user-domain.dto";
import { createUserDto } from "./create-user-dto";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { AUTH_PATH, REGISTRATION_PATH } from "../../../src/core/paths/paths";
import { Express } from "express";
import { UsersRepository } from "../../../src/features/users/repositories/users.repository";
import { WithId } from "mongodb";
import { User } from "../../../src/features/users/domain/user";

export async function createUserWithConfirmationCode(
  app: Express,
  userDto?: CreateUserDomainDto,
): Promise<WithId<User> | null> {
  const testUserData: CreateUserRequestPayload = {
    ...createUserDto(),
    ...userDto,
  };

  const response = await request(app)
    .post(`${AUTH_PATH}${REGISTRATION_PATH.registration}`)
    .send(testUserData)
    .catch((err) => {
      console.error("❌ Request error:", err);
      throw err;
    });

  // console.log("📩 createUser: status =", response.status);
  // console.log("📩 createUser: body =", response.body);

  if (response.status !== HTTP_STATUSES.NO_CONTENT_204) {
    throw new Error(
      `Expected 204, got ${response.status}. Body: ${JSON.stringify(response.body, null, 2)}`,
    );
  }

  const usersRepository = new UsersRepository();
  const user = await usersRepository.findByLogin(testUserData.login);
  return user;
}
