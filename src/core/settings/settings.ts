import { config } from "dotenv";
import {
  AUTH_PATH,
  BLOGS_PATH,
  POSTS_PATH,
  TESTING_PATH,
  USERS_PATH,
} from "../paths/paths";

config(); // добавление переменных из файла .env в process.env

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;
const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017"; //mongodb://localhost:27017
const dbName = process.env.DB_NAME || "blogsApi";
const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "qwerty";

export const SETTINGS = {
  // все хардкодные значения должны быть здесь, для удобства их изменения
  PORT: port,
  PATH: {
    BLOGS: BLOGS_PATH,
    POSTS: POSTS_PATH,
    USERS: USERS_PATH,
    TESTS: TESTING_PATH,
    AUTH: AUTH_PATH,
  },
  ADMIN_AUTH: `${adminUsername}:${adminPassword}`, //YWRtaW46cXdlcnR5 (base64)
  MONGO_URL: mongoURI,
  DB_NAME: dbName,
  COLLECTIONS: {
    BLOGS: "blogs",
    POSTS: "posts",
    USERS: "users",
  },
};
