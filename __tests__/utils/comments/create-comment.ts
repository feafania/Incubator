import request from "supertest";
import { Application } from "express";
import { createCommentDto } from "./create-comment-dto";
import { createPost } from "../posts/create-post";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { COMMENTS_PATH } from "../../../src/core/paths/paths";

/**
 * Стварае каментар. Калі postId не перададзены, аўтаматычна стварае пост з блога.
 */
export async function createComment(
  app: Application,
  accessToken: string,
  postId?: string,
) {
  let finalPostId = postId;

  if (!finalPostId) {
    const post = await createPost(app, accessToken); // аўтаматычна створыць блог + пост
    finalPostId = post.id;
  }

  const dto = createCommentDto();

  const response = await request(app)
    .post(`/posts/${finalPostId}${COMMENTS_PATH}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(dto)
    .expect(HTTP_STATUSES.CREATE_201);

  return response.body;
}
