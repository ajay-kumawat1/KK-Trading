import { Router } from "express";
import {
  login,
  register,
  refresh,
  logout,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { authLimiter } from "../middleware/rateLimit";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});
const loginSchema = z.object({
  body: z.object({ email: z.string().email(), password: z.string().min(6) }),
});

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", authLimiter, logout);

export default router;
