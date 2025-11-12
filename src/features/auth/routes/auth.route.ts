import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { loginUserPayloadValidation } from "./auth-login.payload.validation-middlewares";
import { loginUserHandler } from "./http-handlers/login-user.handler";

export const authRouter = Router({});

authRouter.post(
  "/login",
  loginUserPayloadValidation,
  inputValidationResultMiddleware,
  loginUserHandler,
);
