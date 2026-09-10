import type { Request, Response } from "express";
import mongoose from "mongoose";
import { BookmarkModel } from "../models/Bookmark.js";
import { PostModel } from "../models/Post.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

// @desc    Add post to bookmarks (Idempotent)
// @route   POST /api/bookmarks/:postId
// @access  Private
export const addBookmark = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { postId } = req.params;

  if (typeof postId !== "string" || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID format",
    });
  }

  const post = await PostModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  const existingBookmark = await BookmarkModel.findOne({
    user: userId,
    post: postId,
  });

  // Agar already bookmarked hai toh 409 error throw karne ki jagah existing bookmark hi return karo
  if (existingBookmark) {
    return sendSuccess(res, 200, "Post already bookmarked", {
      bookmark: existingBookmark,
    });
  }

  const bookmark = await BookmarkModel.create({
    user: new mongoose.Types.ObjectId(userId),
    post: new mongoose.Types.ObjectId(postId),
  });

  return sendSuccess(res, 201, "Post bookmarked successfully", { bookmark });
});

// @desc    Remove post from bookmarks (Idempotent)
// @route   DELETE /api/bookmarks/:postId
// @access  Private
export const removeBookmark = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { postId } = req.params;

    if (
      typeof postId !== "string" ||
      !mongoose.Types.ObjectId.isValid(postId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format",
      });
    }

    await BookmarkModel.findOneAndDelete({
      user: userId,
      post: postId,
    });

    return sendSuccess(res, 200, "Bookmark removed successfully");
  },
);

// @desc    Get current user bookmarks
// @route   GET /api/bookmarks
// @access  Private
export const getBookmarks = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const bookmarks = await BookmarkModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "post",
        populate: {
          path: "author",
          select: "name username avatar",
        },
      });

    const validBookmarks = bookmarks.filter((item) => item.post !== null);

    return sendSuccess(res, 200, "Bookmarks fetched successfully", {
      count: validBookmarks.length,
      bookmarks: validBookmarks,
    });
  },
);
