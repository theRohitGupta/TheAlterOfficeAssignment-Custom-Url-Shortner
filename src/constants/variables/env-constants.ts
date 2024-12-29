import dotenv from "dotenv";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT: number = Number(process.env.PORT) || 3000;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const MONGO_DB_URI = process.env.MONGO_URI || "";
export const COOKIE_KEY = process.env.COOKIE_KEY || "";
export const REDIS_HOST = process.env.REDIS_HOST || "";
export const REDIS_PORT = process.env.REDIS_PORT || "";
export const HOSTED_IP = process.env.HOSTED_IP || "http://localhost:";
export default NODE_ENV

// Check if any required environment variables are missing
if (!NODE_ENV || !PORT || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !MONGO_DB_URI || !COOKIE_KEY || !HOSTED_IP || !REDIS_HOST || !REDIS_PORT ) {
  console.error("Missing required environment variables. Exiting...");
  process.exit(1); // Exit the server with an error code
}