import {
  FindQueryResponse,
  PostDBType,
  PostsKeys,
  QueryInput,
} from "../../../db/types";
import { db } from "../../../db/db";
import { mapSortDirection, setDB } from "../../../db/utils";

const postsLocaldbRepository = {
  async findByID(
    id: string | number | undefined,
  ): Promise<PostDBType | null | undefined> {
    if (id) {
      return db.posts.find((post: PostDBType) => post.id === +id);
    }
    return null;
  },

  async findIndex(id: string | number | undefined): Promise<number> {
    if (id) {
      return db.posts.findIndex((post: PostDBType) => post.id === +id);
    }
    return -1;
  },

  async findMany(
    queryDto: QueryInput<PostsKeys>,
    blogId?: string | number,
  ): Promise<FindQueryResponse<PostDBType>> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    let filteredPosts = db.posts.map(post => {
      const blog = db.blogs.find(b => b.id === post.blogId);
      return {
        ...post,
        blogName: blog?.name ?? "",
      };
    });

    if (blogId) {
      filteredPosts = filteredPosts.filter((p) => p.blogId === Number(blogId));
    }

    if (searchNameTerm) {
      const term = searchNameTerm.toLowerCase();
      filteredPosts = filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(term),
      );
    }

    const sortedPosts = [...filteredPosts].sort((a, b) => {
      const direction = mapSortDirection(sortDirection);

      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });

    const startIndex = (pageNumber - 1) * pageSize;
    const items = sortedPosts.slice(startIndex, startIndex + pageSize);
    const totalCount = sortedPosts.length;

    return {
      items,
      totalCount,
    };
  },

  async deleteAllPosts(): Promise<void> {
    await setDB("posts");
  },

  async deletePost(id: number): Promise<boolean> {
    if (id) {
      db.posts.splice(id, 1);
      return true;
    }
    return false;
  },

  async create(input: PostDBType): Promise<PostDBType> {
    db.posts = [...db.posts, input];
    return db.posts[db.posts.length - 1];
  },

  async update(input: PostDBType): Promise<PostDBType> {
    const foundPostIndex = input.id;;

    if (foundPostIndex < 0) {
      throw new Error("Failed to find post");
    }

    const foundPost = db.posts[foundPostIndex];

    db.posts[foundPostIndex] = {
      ...foundPost,
      title: input.title,
      shortDescription: input.shortDescription,
      content: input.content,
      blogId: +input.blogId,
    };

    return db.posts[foundPostIndex];
  },
};

export default postsLocaldbRepository;
