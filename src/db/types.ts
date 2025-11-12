import { BlogDBType } from "../features/blogs/domain/blogs";
import { PostDBType } from "../features/posts/domain/posts";

export type DBType = {
  // типизация базы данных (что мы будем в ней хранить)
  blogs: BlogDBType[];
  posts: PostDBType[];
};
