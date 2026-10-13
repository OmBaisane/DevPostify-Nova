import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AUTH_COOKIE_NAME } from "../constants/auth.js";

interface JwtPayload {
  userId: string;
}

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token || typeof token !== "string") {
    req.userId = undefined;
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (decoded && typeof decoded.userId === "string") {
      req.userId = decoded.userId;
    }
  } catch {
    // Expired or invalid token on a public route: treat gracefully as anonymous
    req.userId = undefined;
  }

  next();
};
