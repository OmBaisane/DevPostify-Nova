import type { Request, Response } from "express";
import { UserModel } from "../models/User.js";
import { hashPassword, createAccessToken } from "../utils/auth.js";
import { sendSuccess } from "../utils/apiResponse.js";

const COOKIE_NAME = "devpostify_token";

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

  if (normalizedPasswordLength(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
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
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendSuccess(res, 201, "Account created successfully", {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
    },
  });
};

const normalizedPasswordLength = (password: string): boolean => {
  return password.length < 8;
};
