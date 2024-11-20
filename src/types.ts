import  {Request} from "express";
import {HTTP_STATUSES, Resolutions} from "./utils";
export type RequestWithBody<T> = Request<{},{},T>
export type RequestWithQuery<T> = Request<{},{},{},T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T,B> = Request<T,{},B>


interface FieldError {
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

type HttpStatusKeys = keyof typeof HTTP_STATUSES;
export type HttpStatusType = typeof HTTP_STATUSES[HttpStatusKeys]

type ResolutionsKeys = keyof typeof Resolutions;
export type ResolutionsType = typeof Resolutions[ResolutionsKeys]

export type VideoDBType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: ResolutionsType[] | null;
}

