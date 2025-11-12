import request from "supertest";
import { Express } from "express";
import { createBlogDto } from "./create-blog-dto";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import CreateBlogInputModel from "../../../src/features/blogs/domain/modeles/CreateModels";

export async function createBlog(
  app: Express,
  blogDto?: Partial<CreateBlogInputModel>,
) {
  const data = { ...createBlogDto(), ...blogDto };

  const response = await request(app)
    .post(BLOGS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(data)
    .expect(HTTP_STATUSES.CREATE_201);

  return response.body;
}
