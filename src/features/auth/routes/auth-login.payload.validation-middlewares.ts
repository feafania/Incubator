import { body } from "express-validator";

const loginOrEmailValidation = body("loginOrEmail")
  .isString()
  .withMessage("loginOrEmail must be a string")
  .trim()
  .notEmpty()
  .withMessage("loginOrEmail cannot be empty");

const loginValidation = body("login")
  .isString()
  .withMessage("Login must be a string")
  .trim()
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage(
    "Login can contain only letters, numbers, underscores and hyphens",
  )
  .isLength({ min: 3, max: 10 })
  .withMessage("Login length must be between 3 and 10 characters");

const emailValidation = body("email")
  .isString()
  .withMessage("Email must be a string")
  .trim()
  .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
  .withMessage("Email format is invalid");

const passwordValidation = (fieldName: string) => {
  return body(fieldName)
    .isString()
    .withMessage(`${fieldName} must be a string`)
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage(`${fieldName} length must be between 6 and 20 characters`);
};

const codeValidation = (fieldName: string) => {
  return body(fieldName)
    .isString()
    .withMessage(`${fieldName} must be a string`)
    .trim()
    .notEmpty()
    .withMessage(`${fieldName} cannot be empty`);
};

export const loginUserPayloadValidation = [
  loginOrEmailValidation,
  passwordValidation("password"),
];

export const registrationRequestPayloadValidation = [
  loginValidation,
  passwordValidation("password"),
  emailValidation,
];

export const registrationEmailResendingPayloadValidation = [emailValidation];

export const registrationConfirmationPayloadValidation = [
  codeValidation("code"),
];

export const passwordRecoveryRequestPayloadValidation = [emailValidation];
export const newPasswordRequestPayloadValidation = [
  passwordValidation("newPassword"),
  codeValidation("recoveryCode"),
];
