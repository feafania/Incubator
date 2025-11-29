import CreateBlogInputModel from "../../../src/features/blogs/routes/request-payloads/create-blog-request.payload";
import { randomUUID } from "node:crypto";

export function createBlogDto(): CreateBlogInputModel {
  const unique = randomUUID().slice(0, 6);

  return {
    name: `Blog-${unique}`,
    description: `This is a description for Blog-${unique}`,
    websiteUrl: `https://example-${unique}.com`,
  };
}
