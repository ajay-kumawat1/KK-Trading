import { Router } from "express";
import { auth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { z } from "zod";
import { getMe, updateMe, deleteMe } from "../controllers/user.controller";

const router = Router();

const updateMeSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
    })
    .refine((d) => Object.keys(d).length > 0, {
      message: "No changes provided",
    }),
});

router.get("/me", auth(), requireRole("user", "admin"), getMe);
router.patch(
  "/me",
  auth(),
  requireRole("user", "admin"),
  validate(updateMeSchema),
  updateMe
);
router.delete("/me", auth(), requireRole("user", "admin"), deleteMe);

export default router;
