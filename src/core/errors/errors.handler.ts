import { Response } from "express";
import { HTTP_STATUSES } from "../types/http-statuses";
import { RepositoryNotFoundError } from "./repository-not-found.error";
import { createErrorMessages } from "./create-error-messages";
import { DomainError } from "./domain.error";
import { FieldError, OutputErrorsType } from "./types/errors";
import { BadRequestError } from "./bad-request.error";
import { ForbiddenError } from "./forbidden.error";

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = HTTP_STATUSES.NOT_FOUND_404;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          detail: error.message,
        },
      ]),
    );

    return;
  }

  if (error instanceof DomainError) {
    const httpStatus = HTTP_STATUSES.UNPROCESSABLE_ENTITY_422;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          source: error.source,
          detail: error.message,
          code: error.code,
        },
      ]),
    );

    return;
  }

  if (error instanceof BadRequestError) {
    const httpStatus = HTTP_STATUSES.BAD_REQUEST_400;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          source: error.source,
          detail: error.message,
        },
      ]),
    );

    return;
  }

  if (error instanceof ForbiddenError) {
    const httpStatus = HTTP_STATUSES.FORBIDDEN_403;
    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          detail: error.message,
        },
      ]),
    );

    return;
  }

  res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  return;
}

export function pushError(
  errors: OutputErrorsType,
  message: string,
  field: string,
): void {
  errors.errorsMessages.push({
    message: message,
    field: field,
  });
}

export function createError(err: any, field: string = ""): OutputErrorsType {
  const errors: OutputErrorsType = { errorsMessages: [] };

  if (err instanceof Error) {
    pushError(errors, err.message, field);
  } else if (typeof err === "string") {
    pushError(errors, err, field);
  } else {
    pushError(errors, "Unknown error", field);
  }
  return errors;
}

export function removeDuplicateFields(
  errors: OutputErrorsType,
): OutputErrorsType {
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
