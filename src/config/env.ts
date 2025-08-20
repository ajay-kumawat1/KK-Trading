import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

// Define schema for environment variables validation
const envSchema = z.object({
  PORT: z.string().optional().default("5000"),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_SECRET: z.string().min(10),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
  SENDGRID_API_KEY: z.string().min(10),
  SENDGRID_FROM: z.string().email(),
});

// Parse and validate env variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

// Export strongly typed env variables
export const env = {
  PORT: Number(parsedEnv.data.PORT),
  MONGO_URI: parsedEnv.data.MONGO_URI,
  JWT_SECRET: parsedEnv.data.JWT_SECRET,
  JWT_EXPIRES_IN: parsedEnv.data.JWT_EXPIRES_IN,
  REFRESH_TOKEN_SECRET: parsedEnv.data.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: parsedEnv.data.REFRESH_TOKEN_EXPIRES_IN,
  SENDGRID_API_KEY: parsedEnv.data.SENDGRID_API_KEY,
  SENDGRID_FROM: parsedEnv.data.SENDGRID_FROM,
};
