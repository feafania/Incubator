import PostOutput from "../output/post.output";
import { PostDocument } from "../../domain/posts";

export function mapToPostOutput(
  post: PostDocument & { blogName: string },
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
