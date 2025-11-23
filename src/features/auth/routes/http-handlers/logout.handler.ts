import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import authService from "../../application/auth.service";
import sessionService from "../../application/session.service";

export async function logoutHandler(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const expiresAt = req.expiresAt!;
    const deviceId = req.deviceId!;
    const oldRefreshToken = req.cookies.refreshToken;

    await authService.revokeToken(oldRefreshToken, {
      userId,
      deviceId,
      expiresAt,
    });
    const session = await sessionService.findExistingSession(userId, deviceId);
    if (session?._id) {
      await sessionService.delete(session._id.toString());
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}
