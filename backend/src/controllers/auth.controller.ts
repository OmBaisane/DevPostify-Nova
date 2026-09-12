import type { Request, Response } from "express";
import { UserModel } from "../models/User.js";
import {
  hashPassword,
  createAccessToken,
  comparePassword,
} from "../utils/auth.js";
import { sendSuccess } from "../utils/apiResponse.js";

const COOKIE_NAME = "devpostify_token";

const isProduction = process.env.NODE_ENV === "production";

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
});

export const register = async (req: Request, res: Response) => {
  const { username, email, password, name } = req.body;

  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Username, email, password and name are required",
    });
  }

  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();

  if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
    return res.status(400).json({
      success: false,
      message: "Username must be between 3 and 30 characters",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  if (!normalizedName) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }

  const existingUser = await UserModel.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (existingUser) {
    const field = existingUser.email === normalizedEmail ? "email" : "username";

    return res.status(409).json({
      success: false,
      message: `An account with this ${field} already exists`,
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = await UserModel.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password: hashedPassword,
    name: normalizedName,
  });

  const token = createAccessToken(user._id.toString());

  res.cookie(COOKIE_NAME, token, {
    ...getAuthCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendSuccess(res, 201, "Account created successfully", {
    user: {
      _id: user._id,
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, username, emailOrUsername, password } = req.body;

  const identifier = (emailOrUsername || email || username || "") as string;

  if (typeof identifier !== "string" || typeof password !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email/username and password are required",
    });
  }

  const normalizedIdentifier = identifier.trim().toLowerCase();

  if (!normalizedIdentifier || !password) {
    return res.status(400).json({
      success: false,
      message: "Email or username and password are required",
    });
  }

  const user = await UserModel.findOne({
    $or: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }],
  }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email/username or password",
    });
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid email/username or password",
    });
  }

  const token = createAccessToken(user._id.toString());

  res.cookie(COOKIE_NAME, token, {
    ...getAuthCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendSuccess(res, 200, "Login successful", {
    user: {
      _id: user._id,
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const user = await UserModel.findById(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return sendSuccess(res, 200, "Current user fetched successfully", {
    user: {
      _id: user._id,
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, getAuthCookieOptions());

  return sendSuccess(res, 200, "Logout successful");
};
