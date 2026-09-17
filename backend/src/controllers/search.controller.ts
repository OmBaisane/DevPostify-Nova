import type { Request, Response } from "express";
import { PostModel } from "../models/Post.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Escapes special regex characters to neutralize ReDoS vectors.
 */
function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export const searchPosts = asyncHandler(async (req: Request, res: Response) => {
  const rawQuery = typeof req.query.q === "string" ? req.query.q : "";
  const sanitizedQuery = rawQuery.trim().slice(0, 100);

  if (!sanitizedQuery) {
    return sendSuccess(res, 200, "Search results fetched successfully", {
      posts: [],
      query: "",
    });
  }

  // Safe escaped regex pattern for fuzzy token search
  const safeRegex = new RegExp(escapeRegex(sanitizedQuery), "i");

  const posts = await PostModel.find({
    $or: [
      { title: safeRegex },
      { content: safeRegex },
      { tags: safeRegex },
      { category: safeRegex },
    ],
  })
    .populate("author", "name username avatar")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return sendSuccess(res, 200, "Search results fetched successfully", {
    posts,
    query: sanitizedQuery,
  });
});
