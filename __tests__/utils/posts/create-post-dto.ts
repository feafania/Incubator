import CreatePostInputModel from "../../../src/features/posts/routes/request-payloads/create-post-request.payload";
import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";

export function createPostDto(id?: string): CreatePostInputModel {
  const unique = randomUUID().slice(0, 6);
  const blogId = id ?? new ObjectId(id).toString();

  return {
    title: `Post-${unique}`,
    shortDescription: `Short description for Post-${unique}`,
    content: `Full content of Post-${unique} with detailed information.`,
    blogId,
  };
}
