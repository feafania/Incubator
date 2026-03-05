// @ts-ignore
import request from "supertest";
import { Application } from "express";
import { TESTING_PATH } from "../../src/core/paths/paths";
import { HTTP_STATUSES } from "../../src/core/types/http-statuses";

export async function clearDb(app: Application) {
  await request(app)
    .delete(`${TESTING_PATH}`)
    .expect(HTTP_STATUSES.NO_CONTENT_204);
  return;
}
