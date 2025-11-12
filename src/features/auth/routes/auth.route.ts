import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { loginUserPayloadValidation } from "./auth-login.payload.validation-middlewares";
import { loginUserHandler } from "./http-handlers/login-user.handler";
import { meUserHandler } from "./http-handlers/me-user.handler";
import { accessTokenGuardMiddleware } from "../../../auth/middlewares/access-token-guard.middleware";
import { LOGIN_PATH, ME_PATH } from "../../../core/paths/paths";

export const authRouter = Router({});

authRouter.post(
  `${LOGIN_PATH}`,
  loginUserPayloadValidation,
  inputValidationResultMiddleware,
  loginUserHandler,
);

authRouter.get(
  `${ME_PATH}`,
  accessTokenGuardMiddleware,
  inputValidationResultMiddleware,
  meUserHandler,
);
