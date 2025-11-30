import { Request, Response, NextFunction } from "express";
import { TooManyRequestsError } from "../../../core/errors/too-many-requests.error";
import { container } from "../../../composition-root";
import { RateLimitService } from "../application/rate-limit.service";

export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const url = req.originalUrl ?? req.baseUrl;

  const rateLimitService = container.get<RateLimitService>(RateLimitService);
  const isLimited = await rateLimitService.isLimited(ip, url);

  if (isLimited) {
    throw new TooManyRequestsError();
  }

  await rateLimitService.register({ ip, url });

  next();
}
