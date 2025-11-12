import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { authQueryService } from "../../application/auth.query.service";

export const meUserHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    const user = await authQueryService.findByIdOrFail(userId);

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    res.status(HTTP_STATUSES.OK_200).json(user);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
