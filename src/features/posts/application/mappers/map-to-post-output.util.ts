import PostOutput from "../output/post.output";
import { PostForOutput } from "../../domain/posts";
import { LikeStatus } from "../../../likes/domain/like-status-type";

export function mapToPostOutput(post: PostForOutput): PostOutput {
  const likesInfo = post.extendedLikesInfo ?? {};
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString() ?? "",
    blogName: post.blogName ?? "",
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: {
      likesCount: likesInfo.likesCount ?? 0,
      dislikesCount: likesInfo.dislikesCount ?? 0,
      myStatus: likesInfo.myStatus ?? LikeStatus.NONE,
      newestLikes: likesInfo.newestLikes ?? [],
    },
  };
}
