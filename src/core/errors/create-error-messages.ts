import { ValidationErrorType } from "./types/validationError";
import { ValidationErrorListOutput } from "./types/validationError.dto";

export const createErrorMessages = (
  errors: ValidationErrorType[],
): ValidationErrorListOutput => {
  return {
    errorsMessages: errors.map((error) => ({
      message: error.detail, //error message
      field: error.source ?? "", //error field
    })),
  };
};
