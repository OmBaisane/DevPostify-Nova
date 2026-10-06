import type { Request, Response } from "express";
import mongoose from "mongoose";
import { PostModel } from "../models/Post.js";
import { ReactionModel } from "../models/Reaction.js";
import { NotificationModel } from "../models/Notification.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Toggle post reaction (add or remove)
// @route   POST /api/posts/:id/react
// @access  Private
export const toggleReaction = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: postId } = req.params;
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

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const existingReaction = await ReactionModel.findOne({
      user: userId,
      post: postId,
    });

    if (existingReaction) {
      // 1. Remove reaction
      await ReactionModel.findByIdAndDelete(existingReaction._id);

      // 2. Decrement post reactionsCount atomically
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        { $inc: { reactionsCount: -1 } },
        { new: true },
      );

      const safeCount = Math.max(0, updatedPost?.reactionsCount || 0);

      return sendSuccess(res, 200, "Reaction removed", {
        isReacted: false,
        reactionsCount: safeCount,
      });
    }

    // 1. Create reaction record
    await ReactionModel.create({
      user: userId,
      post: postId,
      type: "like",
    });

    // 2. Increment post reactionsCount atomically
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $inc: { reactionsCount: 1 } },
      { new: true },
    );

    // 3. Create notification for post author (skip if reacting to own post)
    if (post.author.toString() !== userId) {
      await NotificationModel.create({
        recipient: post.author,
        sender: userId,
        type: "reaction",
        post: post._id,
      });
    }

    return sendSuccess(res, 201, "Reaction added", {
      isReacted: true,
      reactionsCount: updatedPost?.reactionsCount || 1,
    });
  },
);

// @desc    Get current user's reaction status and count
// @route   GET /api/posts/:id/react
// @access  Public (Optional Auth)
export const getReactionStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: postId } = req.params;
    const userId = req.userId;

    if (
      typeof postId !== "string" ||
      !mongoose.Types.ObjectId.isValid(postId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid post ID is required",
      });
    }

    const post = await PostModel.findById(postId).select("reactionsCount");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    let isReacted = false;
    if (userId) {
      const existing = await ReactionModel.exists({
        user: userId,
        post: postId,
      });
      isReacted = !!existing;
    }

    return sendSuccess(res, 200, "Reaction status fetched", {
      isReacted,
      reactionsCount: post.reactionsCount || 0,
    });
  },
);
