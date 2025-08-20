import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import { notFound, errorHandler } from "./middleware/errors";

const app = express();

app.use(helmet());
app.use(cors({ credentials: true, origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(pinoHttp({ logger }));
app.use(morgan("tiny"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
