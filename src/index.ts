import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "./app";
import { runDB } from "./db/mongo.db";
import { SETTINGS } from "./core/settings/settings";

declare global {
  // каб TS не падаў памылку на __dbConnected
  var __dbConnected: boolean | undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!global.__dbConnected) {
    await runDB(SETTINGS.MONGO_URL);
    global.__dbConnected = true;
  }

  return app(req, res);
}
