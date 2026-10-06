import type { Request, Response } from "express";
import mongoose from "mongoose";
import { CommentModel } from "../models/Comment.js";
import { PostModel } from "../models/Post.js";
import { NotificationModel } from "../models/Notification.js";
import { createCommentSchema } from "../validators/comment.validator.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get comments for a specific post
// @route   GET /api/posts/:id/comments
// @access  Public
export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { id: postId } = req.params;

  if (typeof postId !== "string" || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      success: false,
      message: "Valid post ID is required",
    });
  }

  const comments = await CommentModel.find({ post: postId })
    .sort({ createdAt: 1 })
    .populate("author", "name username avatar")
    .lean();

  return sendSuccess(res, 200, "Comments fetched successfully", {
    comments,
    total: comments.length,
  });
});

// @desc    Add a technical comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
export const createComment = asyncHandler(
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

    const parseResult = createCommentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.issues?.[0]?.message || "Validation failed",
      });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // 1. Create comment
    const comment = await CommentModel.create({
      post: postId,
      author: userId,
      content: parseResult.data.content,
    });

    // 2. Increment post commentsCount atomically
    await PostModel.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    // 3. Populate author metadata for immediate frontend response
    const populatedComment = await CommentModel.findById(comment._id)
      .populate("author", "name username avatar")
      .lean();

    // 4. Trigger notification to post author (skip self-comments)
    if (post.author.toString() !== userId) {
      await NotificationModel.create({
        recipient: post.author,
        sender: userId,
        type: "comment",
        post: post._id,
        comment: comment._id,
      });
    }

    return sendSuccess(res, 201, "Comment created successfully", {
      comment: populatedComment,
    });
  },
);

// @desc    Delete own comment
// @route   DELETE /api/comments/:commentId
// @access  Private
export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (
      typeof commentId !== "string" ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid comment ID is required",
      });
    }

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Ownership verification: Only comment creator can delete
    if (comment.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own comments",
      });
    }

    const postId = comment.post;

    // 1. Delete comment
    await CommentModel.findByIdAndDelete(commentId);

    // 2. Decrement post commentsCount atomically
    await PostModel.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });

    return sendSuccess(res, 200, "Comment deleted successfully");
  },
);
