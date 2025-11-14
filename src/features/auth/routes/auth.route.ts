import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {
  loginUserPayloadValidation,
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
  REFRESH_TOKEN_PATH,
  REGISTRATION_PATH,
} from "../../../core/paths/paths";
import { registrationHandler } from "./http-handlers/registration.handler";
import { registrationEmailResendingHandler } from "./http-handlers/registration-email-resending.handler";
import { registrationConfirmationHandler } from "./http-handlers/registration-confirmation.handler";
import { refreshTokenGuardMiddleware } from "../../../auth/middlewares/refresh-token-guard.middleware";
import { refreshTokenHandler } from "./http-handlers/refresh-token.handler";
import { logoutHandler } from "./http-handlers/logout.handler";

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

authRouter.post(
  `${REGISTRATION_PATH.registration}`,
  registrationRequestPayloadValidation,
  inputValidationResultMiddleware,
  registrationHandler,
);

authRouter.post(
  `${REGISTRATION_PATH.registrationEmailResending}`,
  registrationEmailResendingPayloadValidation,
  inputValidationResultMiddleware,
  registrationEmailResendingHandler,
);

authRouter.post(
  `${REGISTRATION_PATH.registrationConfirmation}`,
  registrationConfirmationPayloadValidation,
  inputValidationResultMiddleware,
  registrationConfirmationHandler,
);

authRouter.post(
  `${REFRESH_TOKEN_PATH}`,
  refreshTokenGuardMiddleware,
  inputValidationResultMiddleware,
  refreshTokenHandler,
);

authRouter.post(
  `${LOGOUT_PATH}`,
  refreshTokenGuardMiddleware,
  inputValidationResultMiddleware,
  logoutHandler,
);
