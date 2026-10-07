import type { Request, Response } from "express";
import mongoose from "mongoose";
import { BookmarkModel } from "../models/Bookmark.js";
import { PostModel } from "../models/Post.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get user's bookmarks (filtering out unpublished drafts)
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
        populate: { path: "author", select: "name username avatar" },
      })
      .lean();

    // Strict draft boundary: Filter out any bookmarks whose target post is a private draft
    const validBookmarks = bookmarks.filter(
      (b) =>
        b.post &&
        typeof b.post === "object" &&
        (b.post as { isDraft?: boolean }).isDraft !== true,
    );

    return sendSuccess(res, 200, "Bookmarks fetched successfully", {
      bookmarks: validBookmarks,
      total: validBookmarks.length,
    });
  },
);

// @desc    Save a post to bookmarks
// @route   POST /api/bookmarks/:postId
// @access  Private
export const addBookmark = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (typeof postId !== "string" || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      success: false,
      message: "Valid post ID is required",
    });
  }

  const post = await PostModel.findById(postId).select("isDraft");
  if (!post || post.isDraft === true) {
    return res.status(404).json({
      success: false,
      message: "Post not found or unavailable for bookmarking",
    });
  }

  const bookmark = await BookmarkModel.findOneAndUpdate(
    { user: userId, post: postId },
    { $setOnInsert: { user: userId, post: postId } },
    { upsert: true, new: true },
  );

  return sendSuccess(res, 201, "Post bookmarked successfully", {
    bookmark,
  });
});

// @desc    Remove a post from bookmarks
// @route   DELETE /api/bookmarks/:postId
// @access  Private
export const removeBookmark = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (
      typeof postId !== "string" ||
      !mongoose.Types.ObjectId.isValid(postId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid post ID is required",
      });
    }

    await BookmarkModel.findOneAndDelete({ user: userId, post: postId });

    return sendSuccess(res, 200, "Bookmark removed successfully");
  },
);

// Backward-compatible aliases
export const createBookmark = addBookmark;
export const deleteBookmark = removeBookmark;
