import { Router } from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteUser,
} from "../controllers/user.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
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

router.get("/profile", AuthMiddleware.isValidateJWT, getProfile);
router.patch(
  "/profile",
  AuthMiddleware.isValidateJWT,
  validateBody(updateProfileSchema),
  updateProfile
);
router.post(
  "/change-password",
  AuthMiddleware.isValidateJWT,
  validateBody(changePasswordSchema),
  changePassword
);
router.delete("/delete", AuthMiddleware.isValidateJWT, deleteUser);

export default router;
