import { Request, Response, NextFunction } from "express";
import rateLimitService from "../application/rate-limit.service";
import { TooManyRequestsError } from "../../../core/errors/too-many-requests.error";

export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const url = req.originalUrl ?? req.baseUrl;

  const isLimited = await rateLimitService.isLimited(ip, url);

  if (isLimited) {
    throw new TooManyRequestsError();
  }

  await rateLimitService.register({ ip, url });

  next();
}
