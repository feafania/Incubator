import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";

import { HTTP_STATUSES } from "../../types/http-statuses";
import { OutputErrorsType } from "../../errors/types/errors";
import { pushError, removeDuplicateFields } from "../../errors/errors.handler";

export const inputCheckErrorsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    if (errorArray.length) {
      res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .send(formattedError(errorArray));
      return;
    }
  }
  next();
};

function formattedError(errors: ValidationError[]): OutputErrorsType {
  const outputErrors: OutputErrorsType = { errorsMessages: [] };

  errors.forEach((error) => {
    switch (error.type) {
      case "alternative":
        // Обработка AlternativeValidationError
        error.nestedErrors.forEach((e) => {
          pushError(
            outputErrors,
            `${e.msg} (${e.value})` || " ",
            e.path || " ",
          );
        });
        break;

      case "field":
        // Обработка FieldValidationError
        pushError(
          outputErrors,
          `${error.msg} ('${error.value}')` || " ",
          error.path || " ",
        );
        break;

      default:
        // Обработка неизвестного типа
        pushError(outputErrors, "Unknown error", " ");
        break;
    }
  });

  return removeDuplicateFields(outputErrors);
}
