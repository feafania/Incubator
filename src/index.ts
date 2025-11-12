// startApp + setup
import express from "express";
import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { runDB } from "./db/mongo.db";
import { formattedDate } from "./core/utils";

const bootstrap = async () => {
  const app = express(); // создать приложение

  setupApp(app);

  try {
    await runDB(SETTINGS.MONGO_URL);
  } catch {
    console.log("Error starting server occurred");
    return;
  }

  app.listen(SETTINGS.PORT, "0.0.0.0", () => {
    console.log(
      "...server started in port " +
        SETTINGS.PORT +
        " at " +
        formattedDate(new Date().getTime()),
    );
  });
  return app;
};

bootstrap();
