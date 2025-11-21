import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { SETTINGS } from "../../../../core/settings/settings";
import authService from "../../application/auth.service";

export async function refreshTokenHandler(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const expiresAt = req.expiresAt;
    const deviceId = req.deviceId;
    const oldRefreshToken = req.cookies.refreshToken;

    await authService.revokeToken(oldRefreshToken, userId!, expiresAt!);

    const { accessToken, refreshToken } = await authService.refreshSession(
      userId!,
      deviceId!,
      req,
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
