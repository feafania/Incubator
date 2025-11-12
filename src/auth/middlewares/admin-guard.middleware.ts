import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../../core/types/http-statuses";

config();
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qwerty";

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

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
    return;
  }

  next(); // Успешная авторизация, продолжаем
};
