import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import securityService from "../../application/security.service";

export async function deleteDeviceHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const deviceIdToDelete = req.params.id;
    const userId = req.userId;

    if (!userId) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    await securityService.delete(deviceIdToDelete, userId);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
