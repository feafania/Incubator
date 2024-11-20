import  {Request} from "express";
import {HTTP_STATUSES} from "./utils";
import {ViewBlogModel} from "../features/blogs/modeles/ViewModels";
import {CreateBlogInputModel} from "../features/blogs/modeles/CreateModels";
import {UpdateBlogInputModel} from "../features/blogs/modeles/UpdateModels";
import {ViewPostModel} from "../features/posts/modeles/ViewModels";

export type RequestWithBody<T> = Request<{},{},T>
export type RequestWithQuery<T> = Request<{},{},{},T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T,B> = Request<T,{},B>

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
}

export type BlogDBType = {
    id: number;
    name: string;
    description:string;
    websiteUrl:	string;
    createdAt: Date;
    isMembership: boolean;
}

export type PostDBType = {
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    blogId: number;
    createdAt: Date;
}

export type DBType = { // типизация базы данных (что мы будем в ней хранить)
    blogs: BlogDBType[],
    posts: PostDBType[],
}

type HttpStatusKeys = keyof typeof HTTP_STATUSES;
export type HttpStatusType = typeof HTTP_STATUSES[HttpStatusKeys]

export interface blogReturnType {
    errors?: OutputErrorsType,
    blog?: ViewBlogModel,
}

export interface postReturnType {
    errors?: OutputErrorsType,
    post?: ViewPostModel
}
