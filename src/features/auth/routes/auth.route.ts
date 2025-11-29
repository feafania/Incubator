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
import { loginUserHandler } from "./http-handlers/login-user.handler";
import { meUserHandler } from "./http-handlers/me-user.handler";
import { accessTokenGuardMiddleware } from "../../../auth/middlewares/access-token-guard.middleware";
import {
  LOGIN_PATH,
  LOGOUT_PATH,
  ME_PATH,
  PASSWORD_PATH,
  REFRESH_TOKEN_PATH,
  REGISTRATION_PATH,
} from "../../../core/paths/paths";
import { registrationHandler } from "./http-handlers/registration.handler";
import { registrationEmailResendingHandler } from "./http-handlers/registration-email-resending.handler";
import { registrationConfirmationHandler } from "./http-handlers/registration-confirmation.handler";
import { refreshTokenGuardMiddleware } from "../../../auth/middlewares/refresh-token-guard.middleware";
import { refreshTokenHandler } from "./http-handlers/refresh-token.handler";
import { logoutHandler } from "./http-handlers/logout.handler";
import { rateLimitMiddleware } from "../../rate-limit/middlewares/rate-limit.middleware";
import { refreshSessionGuardMiddleware } from "../../../core/refresh-session-guard.middleware";
import { passwordRecoveryHandler } from "./http-handlers/password-recovery.handler";
import { newPasswordHandler } from "./http-handlers/new-password.handler";

export const authRouter = Router({});

authRouter.post(
  `${LOGIN_PATH}`,
  rateLimitMiddleware,
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

authRouter.post(
  `${REGISTRATION_PATH.registration}`,
  rateLimitMiddleware,
  registrationRequestPayloadValidation,
  inputValidationResultMiddleware,
  registrationHandler,
);

authRouter.post(
  `${REGISTRATION_PATH.registrationEmailResending}`,
  rateLimitMiddleware,
  registrationEmailResendingPayloadValidation,
  inputValidationResultMiddleware,
  registrationEmailResendingHandler,
);

authRouter.post(
  `${REGISTRATION_PATH.registrationConfirmation}`,
  rateLimitMiddleware,
  registrationConfirmationPayloadValidation,
  inputValidationResultMiddleware,
  registrationConfirmationHandler,
);

authRouter.post(
  `${REFRESH_TOKEN_PATH}`,
  refreshTokenGuardMiddleware,
  refreshSessionGuardMiddleware,
  inputValidationResultMiddleware,
  refreshTokenHandler,
);

authRouter.post(
  `${LOGOUT_PATH}`,
  refreshTokenGuardMiddleware,
  refreshSessionGuardMiddleware,
  inputValidationResultMiddleware,
  logoutHandler,
);

authRouter.post(
  `${PASSWORD_PATH.passwordRecovery}`,
  rateLimitMiddleware,
  passwordRecoveryRequestPayloadValidation,
  inputValidationResultMiddleware,
  passwordRecoveryHandler,
);

authRouter.post(
  `${PASSWORD_PATH.newPassword}`,
  rateLimitMiddleware,
  newPasswordRequestPayloadValidation,
  inputValidationResultMiddleware,
  newPasswordHandler,
);
