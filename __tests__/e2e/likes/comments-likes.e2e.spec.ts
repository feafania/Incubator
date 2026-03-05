import request from "supertest";
import { Application } from "express";
import { createTestApp, stopTestDb } from "../../create-test-app";
import { clearDb } from "../../utils/clear-db";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createUserAndLogin } from "../../utils/users/create-user-and-login";
import { createPost } from "../../utils/posts/create-post";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { LikeStatus } from "../../../src/features/likes/domain/like-status-type";

describe("Posts Like Status API", () => {
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

  it("✅ should set Like status; PUT /posts/:id/like-status", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const post = await createPost(app, accessToken);
    await request(app)
      .put(`${POSTS_PATH}/${post.id}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ likeStatus: LikeStatus.LIKE })
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("❌ should return 401 if no token", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const post = await createPost(app, accessToken);

    await request(app)
      .put(`${POSTS_PATH}/${post.id}/like-status`)
      .send({ likeStatus: LikeStatus.LIKE })
      .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("❌ should return 400 if likeStatus is invalid", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const post = await createPost(app, accessToken);

    const res = await request(app)
      .put(`${POSTS_PATH}/${post.id}/like-status`)
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

  it("❌ should return 404 if post does not exist", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const fakeId = "000000000000000000000000";

    await request(app)
      .put(`${POSTS_PATH}/${fakeId}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ likeStatus: LikeStatus.LIKE })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("✅ should change Like to Dislike", async () => {
    const { accessToken } = await createUserAndLogin(app);
    const post = await createPost(app, accessToken);

    await request(app)
      .put(`${POSTS_PATH}/${post.id}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ likeStatus: LikeStatus.LIKE })
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .put(`${POSTS_PATH}/${post.id}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ likeStatus: LikeStatus.DISLIKE })
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it("✅ should keep only 3 newest likes and sort descending", async () => {
    const users = await Promise.all([
      createUserAndLogin(app),
      createUserAndLogin(app),
      createUserAndLogin(app),
      createUserAndLogin(app),
    ]);

    const post = await createPost(app, users[0].accessToken);

    for (const u of users) {
      await request(app)
        .put(`${POSTS_PATH}/${post.id}/like-status`)
        .set("Authorization", `Bearer ${u.accessToken}`)
        .send({ likeStatus: LikeStatus.LIKE })
        .expect(HTTP_STATUSES.NO_CONTENT_204);
    }

    const res = await request(app)
      .get(`${POSTS_PATH}/${post.id}`)
      .set("Authorization", `Bearer ${users[0].accessToken}`)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body.extendedLikesInfo.likesCount).toBe(4);
    expect(res.body.extendedLikesInfo.newestLikes.length).toBe(3);

    const newestLikes = res.body.extendedLikesInfo.newestLikes;

    expect(new Date(newestLikes[0].addedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(newestLikes[1].addedAt).getTime(),
    );
  });
});
