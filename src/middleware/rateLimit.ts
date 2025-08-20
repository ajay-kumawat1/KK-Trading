import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // per IP
  standardHeaders: true,
  legacyHeaders: false,
});
