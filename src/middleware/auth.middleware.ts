import { Request, Response, NextFunction } from "express";
import { decodeToken, generateToken, verifyToken } from "../utils/jwtToken.js";

export class AuthMiddleware {
  static isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
      return next();
    }
    res.status(401).send("Unauthorized");
  }

  static isValidateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Missing Authorization header" });
    }
    const verifyJWT = verifyToken(authHeader);
    if (!verifyJWT) {
      const decodeJwt = decodeToken(authHeader);
      // refresh token
      if (decodeJwt) {
        const newToken = generateToken(decodeJwt.id);
        return res.status(200).json({ refreshToken: newToken });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
    if (!req.user) {
      req.user = {} as any;
    }

    req.user = { id: verifyJWT.id };
    next();
  }
}
