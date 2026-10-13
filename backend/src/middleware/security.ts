import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

// Rate limiter for general public API consumption
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Strict rate limiter for authentication routes (login / register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 login/register attempts per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
});

// Rate limiter for upload signatures
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // max 30 signature generations per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Upload rate limit exceeded, please wait before uploading more files",
  },
});

// CSRF Defense: Verify Origin / Referer on state-changing requests
const STATE_CHANGING_METHODS = new Set(["POST", "PATCH", "DELETE", "PUT"]);

export const verifyRequestOrigin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!STATE_CHANGING_METHODS.has(req.method)) {
    return next();
  }

  // Development bypass (localhost/testing)
  if (env.NODE_ENV !== "production") {
    return next();
  }

  const origin = req.headers.origin || req.headers.referer;
  if (!origin || typeof origin !== "string") {
    res.status(403).json({
      success: false,
      message: "Forbidden: Missing request origin header",
    });
    return;
  }

  try {
    const allowedOrigin = env.CLIENT_URL ? new URL(env.CLIENT_URL).origin : "";
    const requestOrigin = new URL(origin).origin;

    if (allowedOrigin && requestOrigin !== allowedOrigin) {
      res.status(403).json({
        success: false,
        message: "Forbidden: Cross-site request rejected",
      });
      return;
    }

    next();
  } catch {
    res.status(403).json({
      success: false,
      message: "Forbidden: Malformed request origin header",
    });
  }
};
