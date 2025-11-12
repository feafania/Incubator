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
};
