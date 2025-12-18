import { PostDocument } from "../../domain/posts";
import { PostListPaginatedOutput } from "../output/post-list-paginated.output";
import PostOutput from "../output/post.output";

export function mapToPostListPaginatedOutput(
  posts: (PostDocument & { blogName: string })[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): PostListPaginatedOutput {
  return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: posts.map(
      (post): PostOutput => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString() ?? "",
        blogName: post.blogName ?? "",
        createdAt: post.createdAt.toISOString(),
      }),
    ),
  };
}
