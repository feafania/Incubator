import { BlogDBType, BlogsKeys } from "../domain/blogs";
import { blogCollection } from "../../../db/mongo.db";
import {
  FindQueryResponse,
  QueryInput,
} from "../../../core/types/input-response";
import { mapSortDirection } from "../../../core/utils";

function blogsMongoRepository() {
  return {
    async findByID(
      id: string | number | undefined,
    ): Promise<BlogDBType | null | undefined> {
      if (id) {
        return (await blogCollection.findOne(
          { id: +id },
          { projection: { _id: 0 } },
        )) as BlogDBType;
      }
      return null;
    },
    async findIndex(id: string | number | undefined): Promise<number> {
      if (id) {
        //выключаем усе палі, акрамя id
        const foundBlog = await blogCollection.findOne(
          { id: +id },
          { projection: { id: 1, _id: 0 } },
        );
        if (foundBlog) {
          return foundBlog.id;
        }
      }
      return -1;
    },
    async findMany(
      queryDto: QueryInput<BlogsKeys>,
    ): Promise<FindQueryResponse<BlogDBType>> {
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
        .sort({ [sortBy]: mapSortDirection(sortDirection) })

        // пропускаем определённое количество док. перед тем, как вернуть нужный набор данных.
        .skip(skip)

        // ограничивает количество возвращаемых документов до значения pageSize
        .limit(pageSize)
        .toArray()) as BlogDBType[];
      const totalCount = await blogCollection.countDocuments(filter);
      return {
        items,
        totalCount,
      };
    },
    async deleteMany(): Promise<void> {
      await blogCollection.deleteMany({});
    },
    async deleteBlog(id: number): Promise<boolean> {
      if (id) {
        blogCollection.deleteOne({ id: id });
        return true;
      }
      return false;
    },
    async create(input: BlogDBType): Promise<BlogDBType> {
      const result = await blogCollection.insertOne(input);

      if (!result.insertedId) {
        throw new Error("Failed to insert blog");
      }

      const createdBlog = await blogCollection.findOne({
        _id: result.insertedId,
      });
      if (!createdBlog) {
        throw new Error("Failed to retrieve created blog");
      }

      const { _id, ...cleanedBlog } = createdBlog;
      return cleanedBlog;
    },
    async update(input: BlogDBType): Promise<BlogDBType> {
      const foundBlog = await blogCollection.findOne({ id: input.id });

      if (!foundBlog) {
        throw new Error("Failed to find blog");
      }

      // Обновляем пост, используя деструктуризацию для сохранения старых значений
      const updatedFields = {
        name: input.name.trim(),
        description: input.description.trim(),
        websiteUrl: input.websiteUrl.trim(),
        // isMembership: input.isMembership,
      };
      await blogCollection.updateOne(
        { _id: foundBlog._id },
        { $set: updatedFields },
      );

      const updatedBlog = await blogCollection.findOne({ _id: foundBlog._id });
      if (!updatedBlog) {
        throw new Error("Failed to retrieve updated blog");
      }

      const { _id, ...cleanedBlog } = updatedBlog;
      return cleanedBlog;
    },
  };
}

const blogsRepository = blogsMongoRepository();

export default blogsRepository;
