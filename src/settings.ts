import { config } from "dotenv";

config(); // добавление переменных из файла .env в process.env

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;
const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017"; //mongodb://localhost:27017
const dbName = process.env.DB_NAME || "blogsApi";

export const SETTINGS = {
  // все хардкодные значения должны быть здесь, для удобства их изменения
  PORT: port,
  PATH: {
    POSTS: "/posts",
    BLOGS: "/blogs",
    TESTS: "/testing/all-data",
  },
  ADMIN_AUTH: "admin:qwerty", //YWRtaW46cXdlcnR5 (base64)
  MONGO_URL: mongoURI,
  DB_NAME: dbName,
  BLOG_COLLECTION_NAME: "blogs",
  POST_COLLECTION_NAME: "posts",
};
export const useDatebase: "db" | "mongodb" = "mongodb";
