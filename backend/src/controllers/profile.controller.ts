import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UserModel } from "../models/User";
import { PostModel } from "../models/Post";
import { updateProfileSchema } from "../validators/profile.validator";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;

  if (typeof username !== "string" || !username.trim()) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }

  const user = await UserModel.findOne({
    username: username.toLowerCase(),
  }).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Profile not found",
    });
  }

  const posts = await PostModel.find({
    author: user._id,
  })
    .sort({ createdAt: -1 })
    .populate("author", "username name avatar")
    .lean();

  return res.status(200).json({
    success: true,
    data: {
      profile: user,
      posts,
    },
  });
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = updateProfileSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      { $set: result.data },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        profile: user,
      },
    });
  },
);
