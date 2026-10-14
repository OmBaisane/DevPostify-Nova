import type { Request, Response } from "express";
import mongoose from "mongoose";
import { BookmarkModel } from "../models/Bookmark.js";
import { PostModel } from "../models/Post.js";
import { ReactionModel } from "../models/Reaction.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get current user's bookmarked posts
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
      })
      .lean();

    // Filter out deleted posts or draft posts
    const validBookmarks = bookmarks.filter((b) => {
      const p = b.post as unknown as { isDraft?: boolean } | null;
      return p && !p.isDraft;
    });

    // Enrich posts with current viewer's reaction status (Fix for empty heart on bookmarks)
    const postIds: mongoose.Types.ObjectId[] = validBookmarks
      .map((b) => {
        const postObj = b.post as unknown as {
          _id?: mongoose.Types.ObjectId;
        } | null;
        return postObj?._id;
      })
      .filter((id): id is mongoose.Types.ObjectId => Boolean(id));

    let reactedSet = new Set<string>();
    if (postIds.length > 0) {
      const userReactions = await ReactionModel.find({
        user: userId,
        post: { $in: postIds },
      } as Record<string, unknown>)
        .select("post")
        .lean();

      reactedSet = new Set(
        userReactions.map((r) =>
          (
            (r as unknown as Record<string, unknown>).post as {
              toString: () => string;
            }
          ).toString(),
        ),
      );
    }

    const enrichedBookmarks = validBookmarks.map((b) => {
      const postObj = b.post as unknown as Record<string, unknown>;
      const postIdStr = (
        postObj?._id as { toString: () => string }
      )?.toString();

      return {
        ...b,
        post: {
          ...postObj,
          isReactedByMe: postIdStr ? reactedSet.has(postIdStr) : false,
        },
      };
    });

    return sendSuccess(res, 200, "Bookmarks fetched successfully", {
      bookmarks: enrichedBookmarks,
      total: enrichedBookmarks.length,
    });
  },
);

// @desc    Bookmark a post
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

  const post = await PostModel.findById(postId);
  if (!post || post.isDraft) {
    return res.status(404).json({
      success: false,
      message: "Post not found or cannot be bookmarked",
    });
  }

  try {
    await BookmarkModel.create({
      user: userId,
      post: postId,
    });
  } catch (err: unknown) {
    // E11000 duplicate key caught safely (already bookmarked)
    if ((err as { code?: number }).code !== 11000) {
      throw err;
    }
  }

  return sendSuccess(res, 200, "Post bookmarked successfully");
});

// @desc    Remove bookmark from a post
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

    await BookmarkModel.findOneAndDelete({
      user: userId,
      post: postId,
    });

    return sendSuccess(res, 200, "Bookmark removed successfully");
  },
);
