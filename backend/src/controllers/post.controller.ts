import type { Request, Response } from "express";
import mongoose from "mongoose";
import { PostModel } from "../models/Post";
import {
  createPostSchema,
  updatePostSchema,
} from "../validators/post.validator";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const parsed = createPostSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid post data",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const post = await PostModel.create({
    ...parsed.data,
    author: userId,
  });

  return sendSuccess(res, 201, "Post created successfully", post);
});

// @desc    Get all posts (supports category filter, text search, pagination)
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(req.query.limit as string, 10) || 10),
  );
  const skip = (page - 1) * limit;

  const { category, search } = req.query;

  const filter: Record<string, any> = {};

  if (typeof category === "string" && category.trim() !== "") {
    filter.category = category.trim().toLowerCase();
  }

  const isSearchQuery = typeof search === "string" && search.trim() !== "";
  if (isSearchQuery) {
    filter.$text = { $search: (search as string).trim() };
  }

  let query = PostModel.find(filter);

  if (isSearchQuery) {
    query = query
      .select({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" }, createdAt: -1 });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const [posts, totalPosts] = await Promise.all([
    query
      .skip(skip)
      .limit(limit)
      .populate("author", "name username avatar")
      .lean(),
    PostModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalPosts / limit);

  return sendSuccess(res, 200, "Posts fetched successfully", {
    posts,
    pagination: {
      page,
      limit,
      totalPosts,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
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
      message: "Invalid post ID format",
    });
  }

  const post = await PostModel.findById(id).populate(
    "author",
    "name username avatar",
  );

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  return sendSuccess(res, 200, "Post fetched successfully", post);
});

// @desc    Update post by ID
// @route   PATCH /api/posts/:id
// @access  Private
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { id } = req.params;

  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID format",
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
      message: "You are not authorized to update this post",
    });
  }

  const parsed = updatePostSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid update data",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const updatedPost = await PostModel.findByIdAndUpdate(
    id,
    { $set: parsed.data },
    { new: true, runValidators: true },
  ).populate("author", "name username avatar");

  return sendSuccess(res, 200, "Post updated successfully", updatedPost);
});

// @desc    Delete post by ID
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { id } = req.params;

  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID format",
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
      message: "You are not authorized to delete this post",
    });
  }

  await PostModel.findByIdAndDelete(id);

  return sendSuccess(res, 200, "Post deleted successfully");
});
