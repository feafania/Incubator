import request from "supertest";
import { Express } from "express";
import { createPostDto } from "./create-post-dto";
import { createBlog } from "../blogs/create-blog";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";

/**
 * Стварае пост. Калі blogId не перададзены, спачатку стварае блог.
 */
export async function createPost(
  app: Express,
  accessToken: string,
  blogId?: string,
) {
  let finalBlogId = blogId;

  if (!finalBlogId) {
    const blog = await createBlog(app);
    finalBlogId = blog.id;
  }

  const dto = createPostDto(finalBlogId);

  const response = await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    // .set("Authorization", `Bearer ${accessToken}`)
    .send(dto)
    .expect(HTTP_STATUSES.CREATE_201);

  if (response.status !== HTTP_STATUSES.CREATE_201) {
    throw new Error(
      `Failed to create post: expected ${HTTP_STATUSES.CREATE_201}, got ${response.status}`,
    );
  }

  return response.body;
}
