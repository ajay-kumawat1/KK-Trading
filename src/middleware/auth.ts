import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  sub: string;
  role: "user" | "admin";
}
export interface AuthedRequest extends Request {
  user?: JwtPayload;
}

export function auth(required = true) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) {
      if (!required) return next();
      return res.status(401).json({ message: "Missing token" });
    }
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

export function requireRole(...roles: Array<"user" | "admin">) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
