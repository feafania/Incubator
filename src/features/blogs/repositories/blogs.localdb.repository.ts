import {
  BlogDBType,
  QueryInput,
  FindQueryResponse,
  BlogsKeys,
} from "../../../db/types";
import { db } from "../../../db/db";
import { mapSortDirection, setDB } from "../../../db/utils";

export default function blogsLocaldbRepository() {
  return {
    async findByID(
      id: string | number | undefined,
    ): Promise<BlogDBType | null | undefined> {
      if (id) {
        return db.blogs.find((blog: BlogDBType) => blog.id === +id);
      }
      return null;
    },

    async findIndex(id: string | number | undefined): Promise<number> {
      if (id) {
        return db.blogs.findIndex((blog: BlogDBType) => blog.id === +id);
      }
      return -1;
    },

    async findMany(
      queryDto: QueryInput<BlogsKeys>,
    ): Promise<FindQueryResponse<BlogDBType>> {
      const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
        queryDto;

      const skip = (pageNumber - 1) * pageSize;

      let filteredBlogs = db.blogs;
      if (searchNameTerm) {
        const term = searchNameTerm.toLowerCase();
        filteredBlogs = filteredBlogs.filter((blog) =>
          blog.name.toLowerCase().includes(term),
        );
      }

      const sortedBlogs = [...filteredBlogs].sort((a, b) => {
        const direction = mapSortDirection(sortDirection);

        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
        return 0;
      });

      const startIndex = (pageNumber - 1) * pageSize;
      const items = sortedBlogs.slice(startIndex, startIndex + pageSize);
      const totalCount = sortedBlogs.length;

      return {
        items,
        totalCount,
      };
    },

    async deleteAllBlogs(): Promise<void> {
      await setDB("blogs");
    },

    async deleteBlog(id: number): Promise<boolean> {
      if (id) {
        db.blogs.splice(id, 1);
        return true;
      }
      return false;
    },

    async create(input: BlogDBType): Promise<BlogDBType> {
      db.blogs = [...db.blogs, input];
      return db.blogs[db.blogs.length - 1];
    },

    async update(input: BlogDBType): Promise<BlogDBType> {
      const foundBlogIndex = input.id;

      if (foundBlogIndex < 0) {
        throw new Error("Failed to find blog");
      }

      const foundBlog = db.blogs[foundBlogIndex];

      db.blogs[foundBlogIndex] = {
        ...foundBlog, // Першапачатковыя значэнні
        name: input.name,
        description: input.description,
        websiteUrl: input.websiteUrl,
        // isMembership: input.isMembership,
      };

      return db.blogs[foundBlogIndex];
    },
  };
}
