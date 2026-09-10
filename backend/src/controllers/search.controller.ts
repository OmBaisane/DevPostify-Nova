import type { Request, Response } from "express";
import { PostModel } from "../models/Post.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

// @desc    Search posts by query keyword
// @route   GET /api/search?q=keyword
// @access  Public
export const searchPosts = asyncHandler(async (req: Request, res: Response) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (!query) {
    return sendSuccess(res, 200, "Search query is empty", { posts: [] });
  }

  // Case-insensitive regex match across title, content, and tags
  const regex = new RegExp(query, "i");

  const posts = await PostModel.find({
    $or: [{ title: regex }, { content: regex }, { tags: regex }],
  })
    .sort({ createdAt: -1 })
    .populate("author", "name username avatar")
    .limit(20);

  return sendSuccess(res, 200, "Posts matched successfully", { posts });
});
