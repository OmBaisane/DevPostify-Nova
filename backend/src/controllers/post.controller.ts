import type { Request, Response } from "express";
import mongoose from "mongoose";
import { PostModel } from "../models/Post.js";
import { ReactionModel } from "../models/Reaction.js";
import { BookmarkModel } from "../models/Bookmark.js";
import {
  createPostSchema,
  updatePostSchema,
} from "../validators/post.validator.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function sanitizeSearchQuery(query: string): string {
  return query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// @desc    Get all public posts with filtering, sorting, and tag support
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const { category, search, tag, sort = "latest" } = req.query;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(req.query.limit as string) || 10),
  );
  const skip = (page - 1) * limit;

  // $ne: true guarantees both V1 (undefined) and V1.1 (false) public posts render
  const filter: Record<string, unknown> = {
    isDraft: { $ne: true },
  };

  if (
    typeof category === "string" &&
    category.trim() !== "" &&
    category.toLowerCase() !== "all" &&
    category !== "All Topics"
  ) {
    filter.category = category.trim().toLowerCase();
  }

  if (typeof tag === "string" && tag.trim() !== "") {
    filter.tags = tag.trim().toLowerCase();
  }

  const hasSearch = typeof search === "string" && search.trim() !== "";
  if (hasSearch) {
    filter.$text = { $search: sanitizeSearchQuery(search as string) };
  }

  const sortCriteria: Record<string, 1 | -1> =
    sort === "top" ? { reactionsCount: -1, createdAt: -1 } : { createdAt: -1 };

  const [posts, total] = await Promise.all([
    PostModel.find(filter)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .populate("author", "name username avatar")
      .lean(),
    PostModel.countDocuments(filter),
  ]);

  let enrichedPosts = posts as unknown as Array<Record<string, unknown>>;
  if (req.userId && posts.length > 0) {
    const postIds = posts.map((p) => p._id);
    const userReactions = await ReactionModel.find({
      user: req.userId,
      post: { $in: postIds },
    })
      .select("post")
      .lean();

    const reactedSet = new Set(userReactions.map((r) => r.post.toString()));

    enrichedPosts = posts.map((p) => ({
      ...(p as unknown as Record<string, unknown>),
      isReactedByMe: reactedSet.has(
        (p._id as { toString: () => string }).toString(),
      ),
    }));
  }

  return sendSuccess(res, 200, "Posts fetched successfully", {
    posts: enrichedPosts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Valid post ID is required",
    });
  }

  const post = await PostModel.findById(id)
    .populate("author", "name username avatar bio")
    .lean();

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  // Ensure unpublished private drafts are only accessible by the author
  if (
    post.isDraft &&
    (!req.userId || req.userId !== post.author._id.toString())
  ) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  let isReactedByMe = false;
  if (req.userId) {
    const reaction = await ReactionModel.exists({
      user: req.userId,
      post: post._id,
    });
    isReactedByMe = !!reaction;
  }

  return sendSuccess(res, 200, "Post fetched successfully", {
    post: {
      ...post,
      isReactedByMe,
    },
  });
});

// @desc    Create a new technical post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const parseResult = createPostSchema.safeParse(req.body);
  if (!parseResult.success) {
    const firstErrorMessage =
      parseResult.error.issues?.[0]?.message || "Validation failed";

    return res.status(400).json({
      success: false,
      message: firstErrorMessage,
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  const { title, content, category, tags, coverImage, isDraft } = req.body;

  const post = await PostModel.create({
    title,
    content,
    category: category.toLowerCase().trim(),
    tags: Array.isArray(tags)
      ? tags.map((t: string) => t.toLowerCase().trim())
      : [],
    coverImage: typeof coverImage === "string" ? coverImage.trim() : "",
    isDraft: Boolean(isDraft),
    author: req.userId,
  });

  const populatedPost = await PostModel.findById(post._id)
    .populate("author", "name username avatar")
    .lean();

  return sendSuccess(res, 201, "Post created successfully", {
    post: populatedPost,
  });
});

// @desc    Update post
// @route   PATCH /api/posts/:id
// @access  Private
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
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
      message: "Valid post ID is required",
    });
  }

  const parseResult = updatePostSchema.safeParse(req.body);
  if (!parseResult.success) {
    const firstErrorMessage =
      parseResult.error.issues?.[0]?.message || "Validation failed";

    return res.status(400).json({
      success: false,
      message: firstErrorMessage,
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  const post = await PostModel.findById(id);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  if (post.author.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: You can only edit your own posts",
    });
  }

  const { title, content, category, tags, coverImage, isDraft } = req.body;
  const updateData: Record<string, unknown> = {};

  if (typeof title === "string") updateData.title = title.trim();
  if (typeof content === "string") updateData.content = content.trim();
  if (typeof category === "string")
    updateData.category = category.toLowerCase().trim();
  if (Array.isArray(tags))
    updateData.tags = tags.map((t: string) => t.toLowerCase().trim());
  if (typeof coverImage === "string") updateData.coverImage = coverImage.trim();
  if (typeof isDraft === "boolean") updateData.isDraft = isDraft;

  const updatedPost = await PostModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  )
    .populate("author", "name username avatar")
    .lean();

  return sendSuccess(res, 200, "Post updated successfully", {
    post: updatedPost,
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
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
      message: "Valid post ID is required",
    });
  }

  const post = await PostModel.findById(id);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  if (post.author.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: You can only delete your own posts",
    });
  }

  await Promise.all([
    PostModel.findByIdAndDelete(id),
    BookmarkModel.deleteMany({ post: id }),
    ReactionModel.deleteMany({ post: id }),
  ]);

  return sendSuccess(res, 200, "Post deleted successfully");
});

// @desc    Get current user's private drafts
// @route   GET /api/posts/my/drafts
// @access  Private
export const getMyDrafts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const drafts = await PostModel.find({
    author: userId,
    isDraft: true,
  })
    .sort({ updatedAt: -1 })
    .populate("author", "name username avatar")
    .lean();

  return sendSuccess(res, 200, "Drafts fetched successfully", {
    drafts,
    total: drafts.length,
  });
});
