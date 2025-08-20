import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

const JWT_SECRET = config.JWT_SECRET ?? "your_jwt_secret";

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    const data = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return data;
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string): jwt.JwtPayload | null => {
  try {
    const data = jwt.decode(token) as jwt.JwtPayload;
    return data;
  } catch (error) {
    return null;
  }
};
