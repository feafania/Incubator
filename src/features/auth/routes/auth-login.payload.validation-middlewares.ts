import { body } from "express-validator";

const loginOrEmailValidation = body("loginOrEmail")
  .isString()
  .withMessage("loginOrEmail must be a string")
  .trim()
  .notEmpty()
  .withMessage("loginOrEmail cannot be empty");

const passwordValidation = body("password")
  .isString()
  .withMessage("Password must be a string")
  .trim()
  .notEmpty()
  .withMessage("Password cannot be empty");

export const loginUserPayloadValidation = [
  loginOrEmailValidation,
  passwordValidation,
];
