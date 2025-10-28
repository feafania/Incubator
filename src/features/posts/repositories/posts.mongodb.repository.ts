import {
  FindQueryResponse,
  PostDBType,
  PostsKeys,
  QueryInput,
} from "../../../db/types";
import { postCollection } from "../../../db/mongo-db";
import { WithId } from "mongodb";
import { mapSortDirection } from "../../../db/utils";
import {SETTINGS} from "../../../settings";

const postsMongodbRepository = {
  async findByID(
    id: string | number | undefined,
  ): Promise<PostDBType | null | undefined> {
    if (id) {
      return (await postCollection.findOne(
        { id: +id },
        { projection: { _id: 0 } },
      )) as PostDBType;
    }
    return null;
  },

  async findIndex(id: string | number | undefined): Promise<number> {
    if (id) {
      //выключаем усе палі, акрамя id
      const foundPost = await postCollection.findOne(
        { id: +id },
        { projection: { id: 1, _id: 0 } },
      );
      if (foundPost) {
        return foundPost.id;
      }
    }
    return -1;
  },

  async findMany(
    queryDto: QueryInput<PostsKeys>,
    blogId?: string | number,
  ): Promise<FindQueryResponse<PostDBType>> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const matchFilter: Record<string, any> = {};

    if (searchNameTerm) {
      // 'i' робіць неадчувальным для рэгістру
      matchFilter.title = { $regex: searchNameTerm, $options: "i" };
    }
    if (blogId) {
      matchFilter.blogId = Number(blogId);
    }

    // const items = (await postCollection
    //   .find(filter)
    //   // "asc" (по возрастанию), то используется 1
    //   // "desc" — то -1 для сортировки по убыванию. - по алфавиту от Я-А, Z-A
    //   .sort({ [sortBy]: mapSortDirection(sortDirection) })
    //
    //   // пропускаем определённое количество док. перед тем, как вернуть нужный набор данных.
    //   .skip(skip)
    //
    //   // ограничивает количество возвращаемых документов до значения pageSize
    //   .limit(pageSize)
    //   .toArray()) as PostDBType[];
    // const totalCount = await postCollection.countDocuments(filter);

    const pipeline: any[] = [
      { $match: matchFilter },
      {
        $lookup: {
          from: SETTINGS.BLOG_COLLECTION_NAME,
          localField: "blogId",
          foreignField: "id",
          as: "blog",
        },
      },
      { $unwind: { path: "$blog", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          blogName: "$blog.name",
        },
      },
      { $project: { blog: 0, _id: 0 } },
      { $sort: { [sortBy]: mapSortDirection(sortDirection) } },
      { $skip: skip },
      { $limit: pageSize },
    ];

    const items = (await postCollection.aggregate(pipeline).toArray()) as PostDBType[];
    const totalCount = await postCollection.countDocuments(matchFilter);

    return {
      items,
      totalCount,
    };
  },

  async deleteAllPosts(): Promise<void> {
    await postCollection.deleteMany({});
  },

  async deletePost(id: number): Promise<boolean> {
    if (id) {
      postCollection.deleteOne({ id: id });
      return true;
    }
    return false;
  },

  async create(input: PostDBType): Promise<PostDBType> {
    const result = await postCollection.insertOne(input);

    if (!result.insertedId) {
      throw new Error("Failed to insert post");
    }

    const createdPost = await postCollection.findOne({
      _id: result.insertedId,
    });
    if (!createdPost) {
      throw new Error("Failed to retrieve created post");
    }

    const { _id, ...cleanedPost } = createdPost;
    return cleanedPost;
  },

  async update(input: PostDBType): Promise<PostDBType> {
    const foundPost = await postCollection.findOne({ id: input.id });

    if (!foundPost) {
      throw new Error("Failed to find post");
    }

    const updatedFields = {
      title: input.title.trim(),
      shortDescription: input.shortDescription.trim(),
      content: input.content.trim(),
      blogId: input.blogId,
    };

    await postCollection.updateOne(
      { _id: foundPost._id },
      { $set: updatedFields },
    );

    const updatedPost = await postCollection.findOne({ _id: foundPost._id });
    if (!updatedPost) {
      throw new Error("Failed to retrieve updated post");
    }

    const { _id, ...cleanedPost } = updatedPost;
    return cleanedPost;
  },
};

export default postsMongodbRepository;
