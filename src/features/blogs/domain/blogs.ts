import { OutputErrorsType } from "../../../core/errors/types/errors";
import ViewBlogModel from "./modeles/ViewModels";

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

export type BlogsKeys = keyof BlogDBType;

export interface BlogReturnType {
  errors?: OutputErrorsType;
  blog?: ViewBlogModel;
}
