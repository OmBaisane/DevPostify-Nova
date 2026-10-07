import type { Request, Response } from "express";
import { UserModel } from "../models/User.js";
import { PostModel } from "../models/Post.js";
import { updateProfileSchema } from "../validators/profile.validator.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get public developer profile with their posts
// @route   GET /api/profile/:username
// @access  Public (Auth-aware via optionalAuth)
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;

  if (typeof username !== "string" || !username.trim()) {
    return res.status(400).json({
      success: false,
      message: "Valid username parameter is required",
    });
  }

  const cleanUsername = username.toLowerCase().trim();

  const user = await UserModel.findOne({
    username: cleanUsername,
  }).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Developer profile not found",
    });
  }

  // If viewer is the owner, include all posts; if public, strictly exclude drafts
  const isOwner = Boolean(req.userId && req.userId === user._id.toString());

  const postFilter: Record<string, unknown> = {
    author: user._id,
  };

  if (!isOwner) {
    postFilter.isDraft = { $ne: true };
  }

  const posts = await PostModel.find(postFilter)
    .sort({ createdAt: -1 })
    .populate("author", "name username avatar")
    .lean();

  return sendSuccess(res, 200, "Profile fetched successfully", {
    user: {
      _id: user._id,
      id: user._id,
      username: user.username,
      name: user.name,
      bio: user.bio || "",
      avatar: user.avatar || "",
      skills: user.skills || [],
      specialties: user.specialties || [],
      socials: user.socials || { github: "", linkedin: "", website: "" },
      createdAt: user.createdAt,
    },
    posts,
    postsCount: posts.length,
    isOwner,
  });
});

// @desc    Update authenticated user's profile
// @route   PATCH /api/profile
// @access  Private
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstErrorMessage =
        parseResult.error.issues?.[0]?.message || "Validation failed";

      return res.status(400).json({
        success: false,
        message: firstErrorMessage,
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const updateData = parseResult.data;

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return sendSuccess(res, 200, "Profile updated successfully", {
      user: {
        _id: updatedUser._id,
        id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        bio: updatedUser.bio || "",
        avatar: updatedUser.avatar || "",
        skills: updatedUser.skills || [],
        specialties: updatedUser.specialties || [],
        socials: updatedUser.socials || {
          github: "",
          linkedin: "",
          website: "",
        },
        createdAt: updatedUser.createdAt,
      },
    });
  },
);
