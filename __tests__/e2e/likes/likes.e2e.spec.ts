import request from "supertest";
import express from "express";
import { createTestApp, stopTestDb } from "../../create-test-app";
import { clearDb } from "../../utils/clear-db";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createComment } from "../../utils/comments/create-comment";
import { createUserAndLogin } from "../../utils/users/create-user-and-login";
import { COMMENTS_PATH } from "../../../src/core/paths/paths";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";

describe("Comments Like Status API", () => {
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

  it("✅ should set Like status; PUT /comments/:id/like-status", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const comment = await createComment(app, accessToken);

    await request(app)
      .put(`${COMMENTS_PATH}/${comment.id}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ likeStatus: "Like" })
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("✅ should set Dislike status", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const comment = await createComment(app, accessToken);

    await request(app)
      .put(`${COMMENTS_PATH}/${comment.id}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ likeStatus: "Dislike" })
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("❌ should return 401 when no token provided", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const comment = await createComment(app, accessToken);

    await request(app)
      .put(`${COMMENTS_PATH}/${comment.id}/like-status`)
      .send({ likeStatus: "Like" })
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("❌ should return 400 when likeStatus is invalid", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const comment = await createComment(app, accessToken);

    const res = await request(app)
      .put(`${COMMENTS_PATH}/${comment.id}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ likeStatus: "SuperLike" })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "likeStatus",
        }),
      ]),
    );
  });

  it("❌ should return 404 when comment does not exist", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const fakeId = "000000000000000000000000";

    await request(app)
      .put(`${COMMENTS_PATH}/${fakeId}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ likeStatus: "Like" })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("✅ should change Like to Dislike", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const comment = await createComment(app, accessToken);

    await request(app)
      .put(`${COMMENTS_PATH}/${comment.id}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ likeStatus: "Like" })
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .put(`${COMMENTS_PATH}/${comment.id}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ likeStatus: "Dislike" })
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });
});
