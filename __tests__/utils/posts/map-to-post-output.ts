import { datasetBlogValid, post1 } from "../datasets";
import PostOutput from "../../../src/features/posts/application/output/post.output";
import { LikeStatus } from "../../../src/features/likes/domain/like-status-type";

type postType = typeof post1;

export function testMapToPostOutput(
  post: postType,
  blogId: string | null = null,
): PostOutput {
  const likesInfo = post.extendedLikesInfo ?? {};
  const blog = datasetBlogValid.find((b) => b._id.toString() === blogId);
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString() ?? "",
    blogName: blog?.name ?? "",
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: {
      likesCount: likesInfo.likesCount ?? 0,
      dislikesCount: likesInfo.dislikesCount ?? 0,
      myStatus: LikeStatus.NONE,
      newestLikes: likesInfo.newestLikes ?? [],
    },
  };
}
