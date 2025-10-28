import { Request } from "express";
import { HTTP_STATUSES } from "./utils";
import ViewBlogModel from "../features/blogs/modeles/ViewModels";
import ViewPostModel from "../features/posts/modeles/ViewModels";

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>;
export type RequestWithParamsAndQuery<T, B> = Request<T, {}, {}, B>;

// interface Request<
//   Params = {},     // параметры маршруту (напрыклад, /user/:id → { id: string })
//   ResBody = any,   // цела адказу (можна не выкарыстоўваць)
//   ReqBody = any,   // цела запыту (напрыклад, POST-запыты)
//   ReqQuery = any   // query-параметры (?sort=asc&page=2)
// > {
//     params: Params;
//     body: ReqBody;
//     query: ReqQuery;
//     // іншыя ўласцівасці, як напрыклад: headers, method, url, і г.д.
// }

export interface Params {
  id: string; // Параметры звычайна маюць тып `string`, бо яны паступаюць з URL
}

export interface FieldError {
  message: string | null;
  field: string | null;
}

/**
 * const errorsMessages1: FieldError[] = [
 *     { message: 'Invalid input', field: 'username' },
 *     { message: 'Password too short', field: null }
 * ];
 * const errorsMessages2: FieldError[] = [null];
 */

export type OutputErrorsType = {
  errorsMessages: FieldError[];
};

export const BlogSortedFields = [
  "id",
  "name",
  "description",
  "websiteUrl",
  "createdAt",
  "isMembership",
];

export type BlogDBType = {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean; // True if user has not expired membership subscription to blog
};

export const PostSortedFields = [
  "id",
  "title",
  "shortDescription",
  "content",
  "createdAt",
  "blogName",
  "blogId",
];

export type PostDBType = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blogName?: string;
  createdAt: Date;
};

export type DBType = {
  // типизация базы данных (что мы будем в ней хранить)
  blogs: BlogDBType[];
  posts: PostDBType[];
};

export type BlogsKeys = keyof BlogDBType;
export type PostsKeys = keyof PostDBType;

type HttpStatusKeys = keyof typeof HTTP_STATUSES;
export type HttpStatusType = (typeof HTTP_STATUSES)[HttpStatusKeys];

export interface BlogReturnType {
  errors?: OutputErrorsType;
  blog?: ViewBlogModel;
}

export interface PostReturnType {
  errors?: OutputErrorsType;
  post?: ViewPostModel;
}

export enum SortDirections {
  Asc = "asc",
  Desc = "desc",
}

type SortedBy<T> = {
  fieldName: keyof T;
  direction: SortDirections;
};

export interface QueryInput<T> {
  searchNameTerm?: string | null | undefined;
  sortBy: T;
  sortDirection: SortDirections;
  pageNumber: number;
  pageSize: number;
}

export type FindQueryResponse<T> = {
  items: T[];
  totalCount: number;
};

export type PaginatedOutput<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};
