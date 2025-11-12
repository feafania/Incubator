import request from "supertest";
import { Express } from "express";
import { UserOutput } from "../../../src/features/users/application/output/user.output";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";

export async function getUserById(
  app: Express,
  userId: string,
): Promise<UserOutput> {
  const driverResponse = await request(app)
    .get(`${USERS_PATH}/${userId}`)
    .set("Authorization", generateBasicAuthToken())
    .expect(HTTP_STATUSES.OK_200);

  return driverResponse.body;
}
