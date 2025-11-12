import express from "express";
import { setupApp } from "../src/setup-app";

export const createApp = () => {
  const app = express();
  setupApp(app);
  return app;
};
