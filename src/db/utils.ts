import {DBType, FieldError, OutputErrorsType} from "./types";
import {db} from "./db";

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATE_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_AUTHORIZED_401: 401,
    NOT_FOUND_404: 404,
    INTERNAL_SERVER_ERROR_500: 500,
};

export function pushError(errors:OutputErrorsType,message: string,field:string): void {
    errors.errorsMessages.push({
        message: message,
        field: field
    });
}

export function createError(err:any,field:string = ''): OutputErrorsType {
    const errors: OutputErrorsType = {errorsMessages: []};

    if (err instanceof Error) {
        pushError(errors, err.message, field);
    } else if (typeof err === 'string') {
        pushError(errors, err, field);
    } else {
        pushError(errors, 'Unknown error', field);
    }
    return errors;
}

export function removeDuplicateFields(errors: OutputErrorsType): OutputErrorsType {
    const seenFields = new Set<string | null>();
    const uniqueErrors: FieldError[] = [];

    for (const error of errors.errorsMessages) {
        if (!seenFields.has(error.field)) {
            seenFields.add(error.field);
            uniqueErrors.push(error);
        }
    }
    errors.errorsMessages = uniqueErrors;
    return errors;
}

// функция для быстрой очистки/заполнения базы данных для тестов
//T extends keyof DBType – гэта абмежаванне, якое кажа, што T павінен быць адным з ключоў тыпу DBType
export const setDB = async <T extends keyof DBType>(dataName: T, dataset?: DBType[T]) => {
    if (!dataset) {
        db[dataName] = []
        return;
    }

    // заменяем старые значения новыми
    db[dataName] = dataset;
    return;
}

export function formattedDate(timestamp: number): String {
    const date = new Date(timestamp);

// Атрыманне асобных частак даты і часу
    const day = date.getDate().toString().padStart(2, '0'); // дзень з 2 лічбамі
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // месяц з 2 лічбамі (месяцы нумаруюцца з 0)
    const year = date.getFullYear(); // год
    const hours = date.getHours().toString().padStart(2, '0'); // гадзіны
    const minutes = date.getMinutes().toString().padStart(2, '0'); // хвіліны
    const seconds = date.getSeconds().toString().padStart(2, '0'); // секунды

// Прывабная дата ў фармаце: dd/mm/yyyy hh:mm:ss
    return `${day}/${month}/${year} at ${hours}:${minutes}:${seconds}`;

}