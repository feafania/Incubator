import {OutputErrorsType} from "./types";

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATE_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};

export enum Resolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
}

export function pushError(errors:OutputErrorsType,message: string,field:string): void {
    errors.errorsMessages.push({
        message: message,
        field: field
    });
}


