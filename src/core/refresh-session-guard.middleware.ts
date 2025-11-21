import { Request, Response, NextFunction } from "express";
import { HTTP_STATUSES } from "./types/http-statuses";
import sessionService from "../features/auth/application/session.service";
import { authQueryService } from "../features/auth/application/auth.query.service";
import authService from "../features/auth/application/auth.service";

export async function refreshSessionGuardMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;
    const deviceId = req.deviceId;
    const issuedAt = req.issuedAt;
    const expiresAt = req.expiresAt;

    // 1. basic validation
    if (!userId || !deviceId || !issuedAt || !expiresAt) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    if (expiresAt.getTime() < Date.now()) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    // 2. session must exist
    const isValidSession = await sessionService.isSessionValid(
      deviceId,
      issuedAt,
    );

    if (!isValidSession) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    // 3. user must exist
    const user = await authQueryService.findByIdOrFail(userId);
    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    // 4. token must not be revoked
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    const isRevoked = await authService.isRefreshTokenRevoked(refreshToken);
    if (isRevoked) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    next();
  } catch (e) {
    console.error("refreshSession guard error", e);
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
    return;
  }
}
