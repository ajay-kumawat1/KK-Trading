import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimiter } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/errors.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;
