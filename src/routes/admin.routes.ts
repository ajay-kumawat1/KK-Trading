import { Router } from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  toggleUserActive,
} from "../controllers/admin.controller.js";
// import { authenticateJWT } from "../middleware/auth.middleware.js";
// import { requireRole } from "../middleware/roles.js";
import { validateBody } from "../middleware/validate.js";
import { z } from "zod";

const router = Router();

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  roles: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// router.use(authenticateJWT);
// router.use(requireRole("admin"));

router.get("/users", getAllUsers);
router.patch("/user/:id", validateBody(updateUserSchema), updateUser);
router.delete("/user/:id", deleteUser);
router.patch("/user/:id/toggle-active", toggleUserActive);

export default router;
