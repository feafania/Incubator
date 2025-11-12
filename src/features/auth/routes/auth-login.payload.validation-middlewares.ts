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
  .matches(/^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/)
  .withMessage("Email format is invalid");

const passwordValidation = body("password")
  .isString()
  .withMessage("Password must be a string")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Password length must be between 6 and 20 characters");

const confirmationcodeValidation = body("code")
  .isString()
  .withMessage("Confirmation code must be a string")
  .trim()
  .notEmpty()
  .withMessage("Confirmation code cannot be empty");

export const loginUserPayloadValidation = [
  loginOrEmailValidation,
  passwordValidation,
];

export const registrationRequestPayloadValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
];

export const registrationEmailResendingPayloadValidation = [emailValidation];

export const registrationConfirmationPayloadValidation = [
  confirmationcodeValidation,
];
