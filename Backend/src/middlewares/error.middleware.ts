import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { logger } from "../utils/logger";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error("Error occurred", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === "production" 
    ? "Internal server error" 
    : err.message;

  sendError(res, message, 500);
}
