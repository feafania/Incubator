import request from "supertest";
import { Application } from "express";
import { UserOutput } from "../../../src/features/users/application/output/user.output";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";

export async function getUserById(
  app: Application,
  userId: string,
): Promise<UserOutput> {
  const userResponse = await request(app)
    .get(`${USERS_PATH}/${userId}`)
    .set("Authorization", generateBasicAuthToken())
    .expect(HTTP_STATUSES.OK_200);

  return userResponse.body;
}
