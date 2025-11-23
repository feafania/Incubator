import { Request, Response, NextFunction } from "express";
import { HTTP_STATUSES } from "../../core/types/http-statuses";
import { jwtService } from "../../core/infrastructure/token/jwt";
import { JwtConfig, JwtPayload } from "../../core/types/jwt-token";
import { SETTINGS } from "../../core/settings/settings";

export const refreshTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cookie = req.cookies;

    if (!cookie?.refreshToken) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    const token = cookie.refreshToken;

    const configOptions: JwtConfig = {
      expiresIn: SETTINGS.JWT_REFRESH_EXPIRY_PERIOD,
      secret: SETTINGS.JWT_REFRESH_SECRET,
    };

    const payload: JwtPayload | null = jwtService.verifyToken(
      token,
      configOptions,
    );

    if (
      !payload ||
      !payload.userId ||
      !payload.deviceId ||
      !payload.expiresAt ||
      !payload.issuedAt
    ) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    req.userId = payload.userId;
    req.deviceId = payload.deviceId;
    req.expiresAt = payload.expiresAt;
    req.issuedAt = payload.issuedAt;

    next();
  } catch (e) {
    console.error("Auth middleware error", e);
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
    return;
  }
};
