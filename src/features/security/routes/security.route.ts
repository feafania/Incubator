import { Router } from "express";
import { DEVICES_PATH } from "../../../core/paths/paths";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";
import { refreshTokenGuardMiddleware } from "../../../auth/middlewares/refresh-token-guard.middleware";
import { container } from "../../../composition-root";
import { SecurityController } from "./controllers/security.controller";

export const securityRouter = Router({});

const securityController =
  container.get<SecurityController>(SecurityController);

securityRouter
  .get(
    `${DEVICES_PATH}`,
    refreshTokenGuardMiddleware,
    inputValidationResultMiddleware,
    securityController.getDeviceListHandler.bind(securityController),
  )

  .delete(
    `${DEVICES_PATH}`,
    refreshTokenGuardMiddleware,
    inputValidationResultMiddleware,
    securityController.deleteAllDevicesHandler.bind(securityController),
  )

  .delete(
    `${DEVICES_PATH}/:id`,
    refreshTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    securityController.deleteDeviceHandler.bind(securityController),
  );
