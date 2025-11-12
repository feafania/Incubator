import request from "supertest";
import { Express } from "express";
import { UserOutput } from "../../../src/features/users/application/output/user.output";
import { CreateUserRequestPayload } from "../../../src/features/users/routes/request-payloads/create-user-request.payload";
import { CreateUserDomainDto } from "../../../src/features/users/domain/create-user-domain.dto";
import { createUserDto } from "./create-user-dto";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { USERS_PATH } from "../../../src/core/paths/paths";
export async function createUser(
  app: Express,
  userDto?: CreateUserDomainDto,
): Promise<UserOutput> {
  const testUserData: CreateUserRequestPayload = {
    ...createUserDto(),
    ...userDto,
  };

  // console.log("🚀 createUser: sending payload =", testUserData);

  const response = await request(app)
    .post(USERS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testUserData)
    .catch((err) => {
      console.error("❌ Request error:", err);
      throw err;
    });

  // console.log("📩 createUser: status =", response.status);
  // console.log("📩 createUser: body =", response.body);

  if (response.status !== HTTP_STATUSES.CREATE_201) {
    throw new Error(
      `Expected 201, got ${response.status}. Body: ${JSON.stringify(response.body, null, 2)}`,
    );
  }

  return response.body;
}
// export async function createUser(
//   app: Express,
//   userDto?: CreateUserDomainDto,
// ): Promise<UserOutput> {
//   console.log("userDto", userDto);
//   const testUserData: CreateUserRequestPayload = {
//     ...createUserDto(),
//     ...userDto,
//   };
//
//   const createdUserResponse = await request(app)
//     .post(USERS_PATH)
//     .set("Authorization", generateBasicAuthToken())
//     .send(testUserData)
//     .expect(HTTP_STATUSES.CREATE_201);
//
//   return createdUserResponse.body;
// }
