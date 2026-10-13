import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
  name: string;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found with the requested identifier";
  }

  // 2. Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicatedKey = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
    message = `An account or record with this ${duplicatedKey} already exists`;
  }

  // 3. Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  // 4. JSON Body Parse Error (Malformed payload)
  if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Malformed JSON payload provided";
  }

  // Hide internal server crash details in production
  if (statusCode === 500 && env.NODE_ENV === "production") {
    message = "Something went wrong on our servers. Please try again later.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
