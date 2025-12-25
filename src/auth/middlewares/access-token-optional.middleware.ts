import { Request, Response, NextFunction } from "express";
import { jwtService } from "../../core/infrastructure/token/jwt";

export const accessTokenOptionalMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = authHeader.split(" ")[1];

    const payload = jwtService.verifyToken(token);

    if (!payload || !payload.userId) {
      next();
      return;
    }

    req.userId = payload.userId;

    next();
  } catch {
    next();
    return;
  }
};
