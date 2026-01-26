import { PostForOutput } from "../../domain/posts";
import { PostListPaginatedOutput } from "../output/post-list-paginated.output";
import { mapToPostOutput } from "./map-to-post-output.util";

export function mapToPostListPaginatedOutput(
  posts: PostForOutput[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): PostListPaginatedOutput {
  return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: posts.map((post) => mapToPostOutput(post)),
  };
}
