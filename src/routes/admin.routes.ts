import { Router } from "express";
import { auth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { z } from "zod";
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/admin.controller";

const router = Router();
router.use(auth(), requireRole("admin"));

const idParam = z.object({ params: z.object({ id: z.string().length(24) }) });
const createSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["user", "admin"]).optional(),
  }),
});
const updateSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(["user", "admin"]).optional(),
  }),
});

router.get("/users", listUsers);
router.get("/users/:id", validate(idParam), getUser);
router.post("/users", validate(createSchema), createUser);
router.patch("/users/:id", validate(updateSchema), updateUser);
router.delete("/users/:id", validate(idParam), deleteUser);

export default router;
