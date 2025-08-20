import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.js";

export const requireRole = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.roles.includes(requiredRole)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};
