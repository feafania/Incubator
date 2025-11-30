import { ObjectId, WithId } from "mongodb";
import { blogCollection } from "../../../db/mongo.db";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { BlogListRequestPayload } from "../routes/request-payloads/blog-list-request.payload";
import { Blog } from "../domain/blogs";
import { BlogListPaginatedOutput } from "../application/output/blog-list-paginated.output";
import { mapToMongoSortDirection } from "../../../core/helpers/map-to-mongo-sort-direction.util";
import { mapToBlogListPaginatedOutput } from "../application/mappers/map-to-blog-pagination-output.util";
import BlogOutput from "../application/output/blog.output";
import { mapToBlogOutput } from "../application/mappers/map-to-blog-output.util";
import { injectable } from "inversify";

@injectable()
export class BlogQueryRepository {
  async findMany(
    queryDto: BlogListRequestPayload,
  ): Promise<BlogListPaginatedOutput> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const filter = searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: "i" } }
      : {};
    // 'i' робіць неадчувальным для рэгістру
    const items = (await blogCollection
      .find(filter)
      // "asc" (по возрастанию), то используется 1
      // "desc" — то -1 для сортировки по убыванию. - по алфавиту от Я-А, Z-A
      .sort({ [sortBy]: mapToMongoSortDirection(sortDirection) })

      // пропускаем определённое количество док. перед тем, как вернуть нужный набор данных.
      .skip(skip)

      // ограничивает количество возвращаемых документов до значения pageSize
      .limit(pageSize)
      .toArray()) as WithId<Blog>[];

    const totalCount = await blogCollection.countDocuments(filter);

    return mapToBlogListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async findByIdOrFail(id: string): Promise<BlogOutput> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Blog not exist");
    }

    const blog = await blogCollection.findOne({ _id: objectId });

    if (!blog) {
      throw new RepositoryNotFoundError("Blog not exist");
    }

    return mapToBlogOutput(blog);
  }
}
