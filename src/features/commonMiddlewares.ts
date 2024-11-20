import {NextFunction, Request, Response} from "express";
import {ValidationError, validationResult} from "express-validator";
import {HTTP_STATUSES, pushError, removeDuplicateFields} from "../db/utils";
import {OutputErrorsType} from "../db/types";
import {SETTINGS} from "../settings";

export const inputCheckErrorsMiddleware = (req: Request,res: Response,next:NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        if (errorArray.length) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send(formattedError(errorArray));
            return
        }
    }
    next()
}

function formattedError(errors: ValidationError[]): OutputErrorsType {
    const outputErrors: OutputErrorsType = { errorsMessages: [] };

    errors.forEach((error) => {
        switch (error.type) {
            case 'alternative':
                // Обработка AlternativeValidationError
                error.nestedErrors.forEach(e => {
                    pushError(outputErrors, `${e.msg} (${e.value})` || ' ', e.path || ' ');
                });
                break;

            case 'field':
                // Обработка FieldValidationError
                pushError(outputErrors, `${error.msg} ('${error.value}')` || ' ', error.path || ' ');
                break;

            default:
                // Обработка неизвестного типа
                pushError(outputErrors, 'Unknown error', ' ');
                break;
        }
    });

    return removeDuplicateFields(outputErrors);
}

export const checkAuthorization = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers['authorization'] as string // 'Basic xxxx'

    if (!authorization) {
        res
            .sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }
    const bufferContent = Buffer.from(authorization.slice(6), 'base64')
    const decodedAuthorization = bufferContent.toString('utf8')

    // const bufferContent = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
    // const codedAuthorization = bufferContent.toString('base64')

    if ((decodedAuthorization === SETTINGS.ADMIN_AUTH) && (authorization.slice(0, 6).toLowerCase() === 'Basic '.toLowerCase())) {
        next()
    }
    else {

        // if (authorization.slice(6) !== codedAuthorization || authorization.slice(0, 6).toLowerCase() !== 'basic ') {
        res
            .sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }
}