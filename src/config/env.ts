import dotenv from 'dotenv';
dotenv.config();

const asBool = (v?: string, d=false) => v === undefined ? d : /^(true|1|yes)$/i.test(v);

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roles_api_ts',
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  COOKIE_SECURE: asBool(process.env.COOKIE_SECURE, false),
};
