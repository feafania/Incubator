import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import authService from "../../application/auth.service";

export async function logoutHandler(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const oldRefreshToken = req.cookies.refreshToken;
    const expiresAt = req.expiresAt;

    await authService.revokeToken(oldRefreshToken, userId!, expiresAt!);

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}
