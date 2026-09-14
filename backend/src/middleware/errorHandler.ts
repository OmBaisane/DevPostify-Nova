import type { ErrorRequestHandler } from "express";

interface CustomAppError extends Error {
  statusCode?: number;
}

/**
 * Centralized Application Error Boundary.
 * Captures operational errors and formats responses consistently.
 * Never leaks internal stack traces or database schema details to clients in production.
 */
export const errorHandler: ErrorRequestHandler = (
  error: CustomAppError,
  _req,
  res,
  _next,
) => {
  // Operational logging for server instrumentation
  if (process.env.NODE_ENV !== "production") {
    console.error("[Internal Error]:", error);
  }

  const statusCode =
    typeof error.statusCode === "number" &&
    error.statusCode >= 400 &&
    error.statusCode < 600
      ? error.statusCode
      : 500;

  // Protect internal database/query error details from exposing in 500 responses
  const clientMessage =
    statusCode === 500
      ? "An internal server error occurred"
      : error.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
  });
};
