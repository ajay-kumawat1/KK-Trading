import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimiter } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/errors.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { config } from "./config/env.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: config.HOST,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(helmet());
app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;