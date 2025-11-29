import { ObjectId, WithId } from "mongodb";
import { PostListPaginatedOutput } from "../application/output/post-list-paginated.output";
import { PostListRequestPayload } from "../routes/request-payloads/post-list-request.payload";
import { postCollection } from "../../../db/mongo.db";
import PostOutput from "../application/output/post.output";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { mapToPostListPaginatedOutput } from "../application/mappers/map-to-post-pagination-output.util";
import { SETTINGS } from "../../../core/settings/settings";
import { mapPostSortDirection } from "../application/mappers/map-to-post-sort-direction.util";
import { Post } from "../domain/posts";
import { mapToPostOutput } from "../application/mappers/map-to-post-output.util";

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
      { $sort: { [sortBy]: mapPostSortDirection(sortDirection) } },
      { $skip: skip },
      { $limit: pageSize },
    ];

    const items = (await postCollection
      .aggregate(pipeline)
      .toArray()) as (WithId<Post> & { blogName: string })[];

    const totalCount = await postCollection.countDocuments(matchFilter);

    return mapToPostListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async findByIdOrFail(id: string): Promise<PostOutput> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Post not exist");
    }

    const pipeline = [
      { $match: { _id: objectId } },
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

    const post = await postCollection
      .aggregate<Post & { _id: ObjectId; blogName: string }>(pipeline)
      .next();

    if (!post) {
      throw new RepositoryNotFoundError("Post not exist");
    }

    return mapToPostOutput(post);
  }
}
