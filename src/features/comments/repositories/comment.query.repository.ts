import { CommentListPaginatedOutput } from "../application/output/comment-list-paginated.output";
import { CommentListRequestPayload } from "../routes/request-payloads/comment-list-request.payload";
import { CommentOutput } from "../application/output/comment.output";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { mapToCommentListPaginatedOutput } from "../application/mappers/map-to-comment-list-paginated-output.util";
import { mapToCommentOutput } from "../application/mappers/map-to-comment-output.util";
import { injectable } from "inversify";
import mongoose from "mongoose";
import { CommentWithStatus, CommentModel } from "../domain/comment";
import { mapToMongoSortDirection } from "../../../core/helpers/map-to-mongo-sort-direction.util";
import { SETTINGS } from "../../../core/settings/settings";
import { LikeStatus } from "../../likes/domain/like-status-type";

@injectable()
export class CommentQueryRepository {
  async findMany(
    queryDto: CommentListRequestPayload,
    userId?: string,
    filter: Record<string, any> = {},
  ): Promise<CommentListPaginatedOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const matchFilter: Record<string, any> = filter;

    const pipeline = [
      { $match: matchFilter },
      {
        $lookup: {
          from: SETTINGS.COLLECTIONS.LIKES,
          let: {
            commentId: { $toString: "$_id" },
            userId: userId ?? null,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$parentId", "$$commentId"] },
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
        $addFields: {
          "likesInfo.myStatus": {
            $ifNull: [{ $arrayElemAt: ["$myLike.status", 0] }, LikeStatus.NONE],
          },
        },
      },

      { $project: { myLike: 0 } },

      { $sort: { [sortBy]: mapToMongoSortDirection(sortDirection) } },
      { $skip: skip },
      { $limit: pageSize },
    ];

    const items =
      await CommentModel.aggregate<CommentWithStatus>(pipeline).exec();

    const totalCount = await CommentModel.countDocuments(matchFilter);

    // const filter: any = {};
    //
    // const [items, totalCount] = await Promise.all([
    //   CommentModel.find(filter)
    //     .sort({ [sortBy]: mapToMongoSortDirection(sortDirection) })
    //     .skip(skip)
    //     .limit(pageSize)
    //     .exec(),
    //   CommentModel.countDocuments(filter),
    // ]);
    //
    return mapToCommentListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async findCommentsByPost(
    queryDto: CommentListRequestPayload,
    postId: string,
    userId?: string,
  ): Promise<CommentListPaginatedOutput> {
    const filter = { postId };
    return this.findMany(queryDto, userId, filter);
    // const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    // const skip = (pageNumber - 1) * pageSize;

    // const [items, totalCount] = await Promise.all([
    //   CommentModel.find(filter)
    //     .sort({ [sortBy]: mapToMongoSortDirection(sortDirection) })
    //     .skip(skip)
    //     .limit(pageSize)
    //     .exec(),
    //   CommentModel.countDocuments(filter),
    // ]);
    // return mapToCommentListPaginatedOutput(items, {
    //   pageNumber,
    //   pageSize,
    //   totalCount,
    // });
  }

  async findByIdOrFail(id: string, userId?: string): Promise<CommentOutput> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Comment not exist");
    }
    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: SETTINGS.COLLECTIONS.LIKES,
          let: {
            commentId: { $toString: "$_id" },
            userId: userId ?? null,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$parentId", "$$commentId"] },
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
        $addFields: {
          "likesInfo.myStatus": {
            $ifNull: [{ $arrayElemAt: ["$myLike.status", 0] }, LikeStatus.NONE],
          },
        },
      },

      { $project: { myLike: 0 } },
    ];

    const items =
      await CommentModel.aggregate<CommentWithStatus>(pipeline).exec();

    const userComment = items[0];

    if (!userComment) {
      throw new RepositoryNotFoundError("Comment not exist");
    }

    // const userComment = await CommentModel.findById(id);
    //
    // if (!userComment) {
    //   throw new RepositoryNotFoundError("Comment not exist");
    // }
    //
    return mapToCommentOutput(userComment);
  }
}
