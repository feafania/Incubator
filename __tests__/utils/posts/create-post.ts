import request from "supertest";
import { Express } from "express";
import { createPostDto } from "./create-post-dto";
import { createBlog } from "../blogs/create-blog";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { POSTS_PATH } from "../../../src/core/paths/paths";

/**
 * Стварае пост. Калі blogId не перададзены, спачатку стварае блог.
 */
export async function createPost(app: Express, blogId?: string) {
  let finalBlogId = blogId;

  if (!finalBlogId) {
    const blog = await createBlog(app);
    finalBlogId = blog.id;
  }

  const dto = createPostDto(finalBlogId);

  const response = await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(dto)
    .expect(HTTP_STATUSES.CREATE_201);

  return response.body;
}
