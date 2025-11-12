import express from "express";
import { setupApp } from "../src/setup-app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { runDB, stopDb } from "../src/db/mongo.db";

export async function createTestApp() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await runDB(uri);

  const app = express();
  setupApp(app);

  return { app, mongoServer };
}

export async function stopTestDb(mongoServer: MongoMemoryServer) {
  await stopDb();
  await mongoServer.stop();
}
