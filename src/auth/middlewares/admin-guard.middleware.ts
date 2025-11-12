import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../../core/types/http-statuses";
import { SETTINGS } from "../../core/settings/settings";

export const adminGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers["authorization"] as string; // 'Basic xxxx'

  if (!auth) {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
    return;
  }

  const [authType, token] = auth.split(" "); //admin:qwerty

  if (authType !== "Basic") {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
    return;
  }

  const credentials = Buffer.from(token, "base64").toString("utf-8");

  const [username, password] = credentials.split(":");

  if (
    username !== SETTINGS.ADMIN_USERNAME ||
    password !== SETTINGS.ADMIN_PASSWORD
  ) {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
    return;
  }

  next(); // Успешная авторизация, продолжаем
};
