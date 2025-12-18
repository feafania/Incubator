import mongoose from "mongoose";
import { SETTINGS } from "../core/settings/settings";

// Подключения к бд
export async function runDB(url: string): Promise<void> {
  // Разбиваем на часткі, каб падставіць базу:
  const urlObj = new URL(url);
  // urlObj.pathname = "/" -> заменім на назву базы
  urlObj.pathname = `/${SETTINGS.DB_NAME}`;

  const mongoURI = urlObj.toString();

  try {
    // Connect the client to the server
    await mongoose.connect(mongoURI);

    console.log("Connected successfully to Mongo Server");
  } catch (e) {
    // Ensures that the client will close when you finish/error
    console.log("Can't connect to Mongo Server: ", e);
    await mongoose.disconnect();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDb() {
  await mongoose.disconnect();
}
