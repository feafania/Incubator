import { body } from "express-validator";
import { dataIdMatchValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";

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

const passwordValidation = body("password")
  .isString()
  .withMessage("Password must be a string")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Password length must be between 6 and 20 characters");

const emailValidation = body("email")
  .isString()
  .withMessage("Email must be a string")
  .trim()
  .matches(/^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/)
  .withMessage("Email format is invalid");

export const createUserRequestPayloadValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
];

export const updateUserRequestPayloadValidation = [
  dataIdMatchValidation,
  loginValidation,
  passwordValidation,
  emailValidation,
];
