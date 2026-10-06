import type { Request, Response } from "express";
import mongoose from "mongoose";
import { NotificationModel } from "../models/Notification.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const notifications = await NotificationModel.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("sender", "name username avatar")
      .populate("post", "title")
      .lean();

    return sendSuccess(res, 200, "Notifications fetched successfully", {
      notifications,
    });
  },
);

// @desc    Get count of unread notifications
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const count = await NotificationModel.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return sendSuccess(res, 200, "Unread notification count fetched", {
      count,
    });
  },
);

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Valid notification ID is required",
    });
  }

  const notification = await NotificationModel.findOneAndUpdate(
    { _id: id, recipient: userId },
    { $set: { isRead: true } },
    { new: true },
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  return sendSuccess(res, 200, "Notification marked as read");
});

// @desc    Mark all user notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    await NotificationModel.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } },
    );

    return sendSuccess(res, 200, "All notifications marked as read");
  },
);
