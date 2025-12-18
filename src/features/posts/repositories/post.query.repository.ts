import { PostListPaginatedOutput } from "../application/output/post-list-paginated.output";
import { PostListRequestPayload } from "../routes/request-payloads/post-list-request.payload";
import PostOutput from "../application/output/post.output";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { mapToPostListPaginatedOutput } from "../application/mappers/map-to-post-pagination-output.util";
import { SETTINGS } from "../../../core/settings/settings";
import { mapToMongoSortDirection } from "../../../core/helpers/map-to-mongo-sort-direction.util";
import { PostDocument, PostModel } from "../domain/posts";
import { mapToPostOutput } from "../application/mappers/map-to-post-output.util";
import { injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class PostQueryRepository {
  async findMany(
    queryDto: PostListRequestPayload,
    blogId?: string,
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

    const pipeline = [
      { $match: matchFilter },
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
      { $unwind: { path: "$blog", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          blogName: "$blog.name",
        },
      },
      { $project: { blog: 0 } },
      { $sort: { [sortBy]: mapToMongoSortDirection(sortDirection) } },
      { $skip: skip },
      { $limit: pageSize },
    ];

    const items = await PostModel.aggregate<
      PostDocument & { blogName: string }
    >(pipeline).exec();

    const totalCount = await PostModel.countDocuments(matchFilter);

    return mapToPostListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async findByIdOrFail(id: string): Promise<PostOutput> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Post not exist");
    }

    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
      { $unwind: { path: "$blog", preserveNullAndEmptyArrays: true } },
      { $addFields: { blogName: "$blog.name" } },
      { $project: { blog: 0 } },
    ];

    const items = await PostModel.aggregate<
      PostDocument & { blogName: string }
    >(pipeline).exec();

    const post = items[0];

    if (!post) {
      throw new RepositoryNotFoundError("Post not exist");
    }

    return mapToPostOutput(post);
  }
}
