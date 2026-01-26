import { PostListPaginatedOutput } from "../application/output/post-list-paginated.output";
import { PostListRequestPayload } from "../routes/request-payloads/post-list-request.payload";
import PostOutput from "../application/output/post.output";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { mapToPostListPaginatedOutput } from "../application/mappers/map-to-post-pagination-output.util";
import { SETTINGS } from "../../../core/settings/settings";
import { mapToMongoSortDirection } from "../../../core/helpers/map-to-mongo-sort-direction.util";
import { PostForOutput, PostModel } from "../domain/posts";
import { mapToPostOutput } from "../application/mappers/map-to-post-output.util";
import { injectable } from "inversify";
import mongoose from "mongoose";
import { LikeStatus } from "../../likes/domain/like-status-type";

@injectable()
export class PostQueryRepository {
  async findMany(
    queryDto: PostListRequestPayload,
    blogId?: string,
    userId?: string,
  ): Promise<PostListPaginatedOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const matchFilter: Record<string, any> = {};

    if (searchNameTerm) {
      matchFilter.title = { $regex: searchNameTerm, $options: "i" };
    }

    if (blogId) {
      matchFilter.blogId = blogId;
    }

    const postPipeline = getPostPipeline(userId);

    const pipeline = [
      { $match: matchFilter },

      ...postPipeline,

      { $sort: { [sortBy]: mapToMongoSortDirection(sortDirection) } },
      { $skip: skip },
      { $limit: pageSize },
    ];

    const items = await PostModel.aggregate<PostForOutput>(pipeline).exec();

    const totalCount = await PostModel.countDocuments(matchFilter);

    return mapToPostListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async findByIdOrFail(id: string, userId?: string): Promise<PostOutput> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Post not exist");
    }

    const postPipeline = getPostPipeline(userId);

    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $limit: 1 },
      ...postPipeline,
    ];

    const items = await PostModel.aggregate<PostForOutput>(pipeline).exec();

    const post = items[0];

    if (!post) {
      throw new RepositoryNotFoundError("Post not exist");
    }

    return mapToPostOutput(post);
  }
}

function getPostPipeline(userId?: string) {
  return [
    {
      // $lookup: {
      //   from: SETTINGS.COLLECTIONS.BLOGS,
      //   localField: "blogId",
      //   foreignField: "_id",
      //   as: "blog",
      // },
      $lookup: {
        from: SETTINGS.COLLECTIONS.BLOGS,
        let: { blogIdObj: { $toObjectId: "$blogId" } },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$blogIdObj"] } } }],
        as: "blog",
      },
    },

    {
      $lookup: {
        from: SETTINGS.COLLECTIONS.LIKES,
        let: {
          postId: { $toString: "$_id" },
          userId: userId ?? null,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$parentId", "$$postId"] },
                  { $eq: ["$authorId", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "myLike",
      },
    },

    {
      $lookup: {
        from: SETTINGS.COLLECTIONS.USERS,
        let: { newestLikes: "$extendedLikesInfo.newestLikes" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: [
                  { $toString: "$_id" },
                  {
                    $map: {
                      input: { $ifNull: ["$$newestLikes", []] },
                      as: "like",
                      in: "$$like.userId",
                    },
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              userId: { $toString: "$_id" },
              login: 1,
            },
          },
        ],
        as: "likeUsers",
      },
    },

    { $unwind: { path: "$blog", preserveNullAndEmptyArrays: true } },

    {
      $addFields: {
        blogName: "$blog.name",
        extendedLikesInfo: {
          likesCount: { $ifNull: ["$extendedLikesInfo.likesCount", 0] },
          dislikesCount: { $ifNull: ["$extendedLikesInfo.dislikesCount", 0] },

          newestLikes: {
            $map: {
              input: { $ifNull: ["$extendedLikesInfo.newestLikes", []] },
              as: "like",
              in: {
                addedAt: "$$like.addedAt",
                userId: "$$like.userId",
                login: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$likeUsers",
                              as: "u",
                              cond: {
                                $eq: ["$$u.userId", "$$like.userId"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$user.login",
                  },
                },
              },
            },
          },

          myStatus: {
            $ifNull: [{ $arrayElemAt: ["$myLike.status", 0] }, LikeStatus.NONE],
          },
        },
      },
    },

    { $project: { blog: 0, myLike: 0, likeUsers: 0 } },
  ];
}
