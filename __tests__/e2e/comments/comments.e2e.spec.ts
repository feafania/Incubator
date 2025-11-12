import request from "supertest";
import express from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { clearDb } from "../../utils/clear-db";
import { createTestApp, stopTestDb } from "../../create-test-app";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { COMMENTS_PATH } from "../../../src/core/paths/paths";
import { createUserAndLogin } from "../../utils/users/create-user-and-login";
import { createComment } from "../../utils/comments/create-comment";

describe("Comments API", () => {
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

  it("✅ should return 404 when comment not found; GET /comments/:id", async () => {
    const fakeId = "000000000000000000000000";

    const response = await request(app)
      .get(`${COMMENTS_PATH}/${fakeId}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    expect(response.body).toHaveProperty("errorsMessages");
  });

  it("✅ should update comment when authorized and valid; PUT /comments/:id", async () => {
    const { accessToken } = await createUserAndLogin(app);

    const comment = await createComment(app, accessToken); // аўтаматычна стварыць пост і блог

    const updatedContent = "Updated comment content that is at least 20 chars";

    const res = await request(app)
      .put(`${COMMENTS_PATH}/${comment.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: updatedContent });

    expect([HTTP_STATUSES.NO_CONTENT_204, HTTP_STATUSES.OK_200]).toContain(
      res.status,
    );
  });

  it("❌ should not update comment when unauthorized; PUT /comments/:id", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const { id: commentId } = await createComment(app, accessToken); // POST і BLOG аўтаматычна

    await request(app)
      .put(`${COMMENTS_PATH}/${commentId}`)
      .send({ content: "This is a valid comment but no token provided" })
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("❌ should return 404 when trying to update non-existent comment", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const fakeId = "000000000000000000000000";

    const res = await request(app)
      .put(`${COMMENTS_PATH}/${fakeId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Valid content for a comment, but ID is fake",
      });

    expect(res.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("✅ should delete existing comment; DELETE /comments/:id", async () => {
    const { accessToken } = await createUserAndLogin(app);

    const comment = await createComment(app, accessToken);

    await request(app)
      .delete(`${COMMENTS_PATH}/${comment.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect([HTTP_STATUSES.NO_CONTENT_204, HTTP_STATUSES.NOT_FOUND_404]);

    await request(app)
      .get(`${COMMENTS_PATH}/${comment.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("❌ should not delete comment without token; DELETE /comments/:id", async () => {
    const { id: commentId } = await createComment(
      app,
      await createUserAndLogin(app).then((u) => u.accessToken),
    );

    await request(app)
      .delete(`${COMMENTS_PATH}/${commentId}`)
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });
});
