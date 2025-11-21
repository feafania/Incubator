import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { securityQueryService } from "../../application/security.query.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";

export async function getDeviceListHandler(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }
    const deviceListOutput =
      await securityQueryService.findManyByUserId(userId);
    res.send(deviceListOutput); //200 па змоўчаньні і ў json фармаце для аб'екта
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
