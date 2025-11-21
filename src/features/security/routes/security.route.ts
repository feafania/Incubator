import { Router } from "express";
import { DEVICES_PATH } from "../../../core/paths/paths";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";
import { refreshTokenGuardMiddleware } from "../../../auth/middlewares/refresh-token-guard.middleware";
import { getDeviceListHandler } from "./http-handlers/get-device-list.handler";
import { deleteAllDevicesHandler } from "./http-handlers/delete-all-devices.handler";
import { deleteDeviceHandler } from "./http-handlers/delete-device.handler";

export const securityRouter = Router({});

securityRouter
  .get(
    `${DEVICES_PATH}`,
    refreshTokenGuardMiddleware,
    inputValidationResultMiddleware,
    getDeviceListHandler,
  )

  .delete(
    `${DEVICES_PATH}`,
    refreshTokenGuardMiddleware,
    inputValidationResultMiddleware,
    deleteAllDevicesHandler,
  )

  .delete(
    `${DEVICES_PATH}/:id`,
    refreshTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteDeviceHandler,
  );
