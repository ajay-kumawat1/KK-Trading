import { Router } from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteUser,
} from "../controllers/user.controller.js";
import { authenticateJWT } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { z } from "zod";

const router = Router();

const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  // add other allowed fields here
});

const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6),
});

router.get("/profile", authenticateJWT, getProfile);
router.patch(
  "/profile",
  authenticateJWT,
  validateBody(updateProfileSchema),
  updateProfile
);
router.post(
  "/change-password",
  authenticateJWT,
  validateBody(changePasswordSchema),
  changePassword
);
router.delete("/delete", authenticateJWT, deleteUser);

export default router;
