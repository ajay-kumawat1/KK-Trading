import { Router } from "express";
import {
  registerUser,
  verifyOTP,
  loginUser,
  refreshToken,
  logoutUser,
} from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validate.js";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

router.post("/register", validateBody(registerSchema), registerUser);
router.post("/verify-otp", validateBody(verifyOTPSchema), verifyOTP);
router.post("/login", validateBody(loginSchema), loginUser);
router.post("/refresh-token", validateBody(refreshSchema), refreshToken);
router.post("/logout", validateBody(refreshSchema), logoutUser);

export default router;
