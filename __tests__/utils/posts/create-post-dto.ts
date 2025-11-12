import { v4 as uuidv4 } from "uuid";
import CreatePostInputModel from "../../../src/features/posts/domain/modeles/CreateModels";

export function createPostDto(blogId?: string): CreatePostInputModel {
  const unique = uuidv4().slice(0, 6);

  return {
    title: `Post-${unique}`,
    shortDescription: `Short description for Post-${unique}`,
    content: `Full content of Post-${unique} with detailed information.`,
    blogId,
  };
}
