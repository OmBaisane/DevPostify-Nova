import type { Request, Response } from "express";
import mongoose from "mongoose";
import { PostModel } from "../models/Post.js";
import { ReactionModel } from "../models/Reaction.js";
import { NotificationModel } from "../models/Notification.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Toggle post reaction (add or remove) safely under concurrent requests
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

    // Draft boundary: Reactions are prohibited on unpublished drafts
    if (post.isDraft) {
      return res.status(400).json({
        success: false,
        message: "Cannot react to an unpublished draft",
      });
    }

    // Atomically check if reaction already exists
    const existingReaction = await ReactionModel.findOneAndDelete({
      user: userId,
      post: postId,
    });

    let isReacted = false;

    if (existingReaction) {
      // Reaction removed: Clean up any pending notification for this specific reaction
      await NotificationModel.findOneAndDelete({
        recipient: post.author,
        sender: userId,
        type: "reaction",
        post: post._id,
      }).catch(() => null);

      isReacted = false;
    } else {
      // Reaction add attempt
      try {
        await ReactionModel.create({
          user: userId,
          post: postId,
          type: "like",
        });
        isReacted = true;

        // Trigger notification if not author's own post (upsert style avoid spam)
        if (post.author.toString() !== userId) {
          await NotificationModel.findOneAndUpdate(
            {
              recipient: post.author,
              sender: userId,
              type: "reaction",
              post: post._id,
            },
            {
              $setOnInsert: {
                recipient: post.author,
                sender: userId,
                type: "reaction",
                post: post._id,
                read: false,
              },
            },
            { upsert: true, new: true },
          ).catch(() => null);
        }
      } catch (err: unknown) {
        // E11000: Race condition duplicate hit caught safely without failing request
        if ((err as { code?: number }).code === 11000) {
          isReacted = true;
        } else {
          throw err;
        }
      }
    }

    // Reconcile actual reaction count to guarantee 100% truth and zero counter drift
    const actualCount = await ReactionModel.countDocuments({ post: postId });

    await PostModel.findByIdAndUpdate(
      postId,
      { $set: { reactionsCount: actualCount } },
      { new: true },
    );

    return sendSuccess(
      res,
      200,
      isReacted ? "Reaction added" : "Reaction removed",
      {
        isReacted,
        reactionsCount: actualCount,
      },
    );
  },
);

// @desc    Get current user's reaction status and count
// @route   GET /api/posts/:id/react
// @access  Public (Auth-aware via optionalAuth)
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

    const post = await PostModel.findById(postId).select(
      "reactionsCount isDraft author",
    );
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Draft privacy: If draft, hide unless owner
    if (post.isDraft && (!userId || userId !== post.author.toString())) {
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
