import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { SecurityService } from "../../application/security.service";
import { SecurityQueryService } from "../../application/security.query.service";

@injectable()
export class SecurityController {
  constructor(
    @inject(SecurityService) private securityService: SecurityService,
    @inject(SecurityQueryService)
    private securityQueryService: SecurityQueryService,
  ) {}

  async deleteAllDevicesHandler(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const currentDeviceId = req.deviceId;

      if (!userId || !currentDeviceId) {
        res.sendStatus(401);
        return;
      }

      await this.securityService.deleteManyExcept(currentDeviceId, userId);

      res.sendStatus(204);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async deleteDeviceHandler(req: Request<{ id: string }>, res: Response) {
    try {
      const deviceIdToDelete = req.params.id;
      const userId = req.userId;

      if (!userId) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        return;
      }

      await this.securityService.delete(deviceIdToDelete, userId);

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getDeviceListHandler(req: Request, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        return;
      }
      const deviceListOutput =
        await this.securityQueryService.findManyByUserId(userId);
      res.send(deviceListOutput); //200 па змоўчаньні і ў json фармаце для аб'екта
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
