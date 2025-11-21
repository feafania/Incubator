import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import securityService from "../../application/security.service";

export async function deleteAllDevicesHandler(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const currentDeviceId = req.deviceId;

    if (!userId || !currentDeviceId) {
      res.sendStatus(401);
      return;
    }

    await securityService.deleteManyExcept(currentDeviceId, userId);

    res.sendStatus(204);
  } catch (e) {
    errorsHandler(e, res);
  }
}
