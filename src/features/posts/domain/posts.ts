import { OutputErrorsType } from "../../../core/errors/types/errors";
import ViewPostModel from "./modeles/ViewModels";

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

export type PostsKeys = keyof PostDBType;

export interface PostReturnType {
  errors?: OutputErrorsType;
  post?: ViewPostModel;
}
