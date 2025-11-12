import { Request, Response, NextFunction } from "express";
import { HTTP_STATUSES } from "../../core/types/http-statuses";
import { jwtService } from "../../core/infrastructure/token/jwt";

export const accessTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    const token = authHeader.split(" ")[1];

    const payload = jwtService.verifyToken(token);

    if (!payload || !payload.userId) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      return;
    }

    req.userId = payload.userId;

    next();
  } catch (e) {
    console.error("Auth middleware error", e);
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
    return;
  }
};
