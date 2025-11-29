import { WithId } from "mongodb";
import { Blog } from "../../domain/blogs";
import BlogOutput from "../output/blog.output";

export function mapToBlogOutput(blog: WithId<Blog>): BlogOutput {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
  };
}
