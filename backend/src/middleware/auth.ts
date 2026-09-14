import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserModel } from "../models/User";

const COOKIE_NAME = "devpostify_token";

interface AuthPayload {
  userId: string;
}

// Augment Express Request interface strictly across middleware boundary
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Authentication Gatekeeper Middleware.
 * Extracts and verifies JWT from cross-domain HTTP-Only secure cookies.
 * Performs database existence verification to invalidate stale or revoked sessions immediately.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify cryptographic signature against server secret
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Ensure the associated user record has not been purged from MongoDB
    const user = await UserModel.findById(decoded.userId).select("_id");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // Attach validated identity ID for downstream controllers
    req.userId = user._id.toString();

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};
