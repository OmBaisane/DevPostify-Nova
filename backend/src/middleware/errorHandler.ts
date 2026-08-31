import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  const statusCode =
    typeof error.statusCode === "number" ? error.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message || "Something went wrong",
  });
};
