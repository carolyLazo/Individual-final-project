import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL || "",
  apiBaseUrl: process.env.API_BASE_URL || "",
};
export const dbConfig = {
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
};
