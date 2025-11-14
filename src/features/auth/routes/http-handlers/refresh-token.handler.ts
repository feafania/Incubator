import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { authQueryService } from "../../application/auth.query.service";
import { SETTINGS } from "../../../../core/settings/settings";
import authService from "../../application/auth.service";
import { TokenType } from "../../domain/token-type";

export async function refreshTokenHandler(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const oldRefreshToken = req.cookies.refreshToken;
    const expiresAt = req.expiresAt;

    if (!userId) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    if (!expiresAt || expiresAt.getTime() < Date.now()) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    const user = await authQueryService.findByIdOrFail(userId);

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    if (await authService.isRefreshTokenRevoked(oldRefreshToken)) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    await authService.revokeToken(oldRefreshToken, userId, expiresAt);

    const accessToken = authService.generateToken({ userId });
    const refreshToken = authService.generateToken(
      { userId },
      TokenType.REFRESH,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: parseInt(String(SETTINGS.JWT_REFRESH_EXPIRY_PERIOD)) * 1000,
    });

    return res.status(HTTP_STATUSES.OK_200).json({
      accessToken: accessToken,
    });
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}
