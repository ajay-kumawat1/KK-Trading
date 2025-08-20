import dotenv from "dotenv";
dotenv.config();

interface IConfig {
  PORT: number;
  HOST: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  SENDGRID_API_KEY: string;
  SENDGRID_FROM: string;
}

export const config: IConfig = {
  PORT: Number(process.env.PORT) || 3000,
  HOST: process.env.HOST as string,
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY as string,
  SENDGRID_FROM: process.env.SENDGRID_FROM as string,
};
