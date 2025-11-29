import { WithId } from "mongodb";
import PostOutput from "../output/post.output";
import { Post } from "../../domain/posts";

export function mapToPostOutput(
  post: WithId<Post> & { blogName: string },
): PostOutput {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString() ?? "",
    blogName: post.blogName ?? "",
    createdAt: post.createdAt.toISOString(),
  };
}
