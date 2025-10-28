import { app } from "./app";
import { SETTINGS } from "./settings";
import { formattedDate } from "./db/utils";
import { runDB } from "./db/db";
import { setupSwagger } from "./swager";

const startApp = async () => {
  const appStarted = await runDB();
  if (appStarted) {
    setupSwagger(app);
    app.listen(SETTINGS.PORT, "0.0.0.0", () => {
      console.log(
        "...server started in port " +
          SETTINGS.PORT +
          " at " +
          formattedDate(new Date().getTime()),
      );
    });
  } else {
    console.log("Error starting server occurred");
  }
};

startApp();
