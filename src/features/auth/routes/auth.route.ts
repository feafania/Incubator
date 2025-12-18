import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {
  loginUserPayloadValidation,
  newPasswordRequestPayloadValidation,
  passwordRecoveryRequestPayloadValidation,
  registrationConfirmationPayloadValidation,
  registrationEmailResendingPayloadValidation,
  registrationRequestPayloadValidation,
} from "./auth-login.payload.validation-middlewares";
import { accessTokenGuardMiddleware } from "../../../auth/middlewares/access-token-guard.middleware";
import {
  LOGIN_PATH,
  LOGOUT_PATH,
  ME_PATH,
  PASSWORD_PATH,
  REFRESH_TOKEN_PATH,
  REGISTRATION_PATH,
} from "../../../core/paths/paths";
import { refreshTokenGuardMiddleware } from "../../../auth/middlewares/refresh-token-guard.middleware";
import { rateLimitMiddleware } from "../../rate-limit/middlewares/rate-limit.middleware";
import { refreshSessionGuardMiddleware } from "../../../core/middlewares/validation/refresh-session-guard.middleware";
import { container } from "../../../composition-root";
import { AuthController } from "./controllers/auth.controller";

export const authRouter = Router({});

const authController = container.get<AuthController>(AuthController);

authRouter.post(
  `${LOGIN_PATH}`,
  rateLimitMiddleware,
  loginUserPayloadValidation,
  inputValidationResultMiddleware,
  authController.loginUserHandler.bind(authController),
);

authRouter.get(
  `${ME_PATH}`,
  accessTokenGuardMiddleware,
  inputValidationResultMiddleware,
  authController.meUserHandler.bind(authController),
);

authRouter.post(
  `${REGISTRATION_PATH.registration}`,
  rateLimitMiddleware,
  registrationRequestPayloadValidation,
  inputValidationResultMiddleware,
  authController.registrationHandler.bind(authController),
);

authRouter.post(
  `${REGISTRATION_PATH.registrationEmailResending}`,
  rateLimitMiddleware,
  registrationEmailResendingPayloadValidation,
  inputValidationResultMiddleware,
  authController.registrationEmailResendingHandler.bind(authController),
);

authRouter.post(
  `${REGISTRATION_PATH.registrationConfirmation}`,
  rateLimitMiddleware,
  registrationConfirmationPayloadValidation,
  inputValidationResultMiddleware,
  authController.registrationConfirmationHandler.bind(authController),
);

authRouter.post(
  `${REFRESH_TOKEN_PATH}`,
  refreshTokenGuardMiddleware,
  refreshSessionGuardMiddleware,
  inputValidationResultMiddleware,
  authController.refreshTokenHandler.bind(authController),
);

authRouter.post(
  `${LOGOUT_PATH}`,
  refreshTokenGuardMiddleware,
  refreshSessionGuardMiddleware,
  inputValidationResultMiddleware,
  authController.logoutHandler.bind(authController),
);

authRouter.post(
  `${PASSWORD_PATH.passwordRecovery}`,
  rateLimitMiddleware,
  passwordRecoveryRequestPayloadValidation,
  inputValidationResultMiddleware,
  authController.passwordRecoveryHandler.bind(authController),
);

authRouter.post(
  `${PASSWORD_PATH.newPassword}`,
  rateLimitMiddleware,
  newPasswordRequestPayloadValidation,
  inputValidationResultMiddleware,
  authController.newPasswordHandler.bind(authController),
);
