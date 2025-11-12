import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from "express-validator";
import { ValidationErrorType } from "../../errors/types/validationError";
import { HTTP_STATUSES } from "../../types/http-statuses";
import { NextFunction } from "express";
import { createErrorMessages } from "../../errors/create-error-messages";
import { Request, Response } from "express";

const formatValidationError = (error: ValidationError): ValidationErrorType => {
  const expressError = error as unknown as FieldValidationError;

  return {
    status: HTTP_STATUSES.BAD_REQUEST_400,
    source: expressError.path,
    detail: expressError.msg,
  };
};

export const inputValidationResultMiddleware = (
  req: Request<{}, {}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatValidationError)
    .array({ onlyFirstError: true });

  if (!errors.length) {
    next();
    return;
  }
  res.status(HTTP_STATUSES.BAD_REQUEST_400).json(createErrorMessages(errors));
  return;
};
