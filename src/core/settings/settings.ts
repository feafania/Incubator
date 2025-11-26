import { config } from "dotenv";
import {
  AUTH_PATH,
  BLOGS_PATH,
  COMMENTS_PATH,
  POSTS_PATH,
  SECURITY_PATH,
  TESTING_PATH,
  USERS_PATH,
} from "../paths/paths";

config(); // добавление переменных из файла .env в process.env

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;
const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017"; //mongodb://localhost:27017
const dbName = process.env.DB_NAME || "blogsApi";
const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "qwerty";
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET || "JWTAccessSecret";
const jwtAccessExpiryPeriod = process.env.JWT_ACCESS_EXPIRY_PERIOD || 10;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || "JWTRefreshSecret";
const jwtRefreshExpiryPeriod = process.env.JWT_REFRESH_EXPIRY_PERIOD || 20;
const email = process.env.EMAIL || "myemail@tut.by";
const emailPass = process.env.EMAIL_PASS || "mypassword";
const smtpHost = process.env.SMTP_HOST || "smtp.yourdomain.com";
const smtpPort = +(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === "true";
const registrationCodeLife = +(process.env.REGISTRATION_CODE_LIFE || 1); // У гадзінах
const passwordCodeLife = +(process.env.PASSWORD_CODE_LIFE || 10); // У хвілінах

export const SETTINGS = {
  // все хардкодные значения должны быть здесь, для удобства их изменения
  PORT: port,
  PATH: {
    BLOGS: BLOGS_PATH,
    POSTS: POSTS_PATH,
    USERS: USERS_PATH,
    TESTS: TESTING_PATH,
    AUTH: AUTH_PATH,
    COMMENTS: COMMENTS_PATH,
    SECURITY: SECURITY_PATH,
  },
  ADMIN_AUTH: `${adminUsername}:${adminPassword}`, //YWRtaW46cXdlcnR5 (base64)
  ADMIN_USERNAME: adminUsername,
  ADMIN_PASSWORD: adminPassword,
  MONGO_URL: mongoURI,
  DB_NAME: dbName,
  COLLECTIONS: {
    BLOGS: "blogs",
    POSTS: "posts",
    USERS: "users",
    COMMENTS: "comments",
    REVOKED_TOKENS: "revokedTokens",
    RATE_LIMIT: "rateLimit",
    SESSIONS: "sessions",
  },
  JWT_ACCESS_SECRET: jwtAccessSecret,
  JWT_ACCESS_EXPIRY_PERIOD: jwtAccessExpiryPeriod,
  JWT_REFRESH_SECRET: jwtRefreshSecret,
  JWT_REFRESH_EXPIRY_PERIOD: jwtRefreshExpiryPeriod,
  EMAIL: email,
  EMAIL_PASS: emailPass,
  SMTP_HOST: smtpHost,
  SMTP_PORT: smtpPort,
  SMTP_SECURE: smtpSecure,
  REGISTRATION_CODE_LIFE: registrationCodeLife,
  PASSWORD_CODE_LIFE: passwordCodeLife,
};
