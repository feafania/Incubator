import { v4 as uuidv4 } from "uuid";
import CreateBlogInputModel from "../../../src/features/blogs/domain/modeles/CreateModels";

export function createBlogDto(): CreateBlogInputModel {
  const unique = uuidv4().slice(0, 6);

  return {
    name: `Blog-${unique}`,
    description: `This is a description for Blog-${unique}`,
    websiteUrl: `https://example-${unique}.com`,
  };
}
