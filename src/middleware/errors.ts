import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Not Found" });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status || 500;
  const msg = err.message || "Internal Server Error";
  if (status >= 500) logger.error({ err }, msg);
  res.status(status).json({ message: msg });
}
