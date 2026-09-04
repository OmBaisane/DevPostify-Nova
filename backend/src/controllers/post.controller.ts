import type { Request, Response } from "express";
import mongoose from "mongoose";
import { PostModel } from "../models/Post";
import {
  createPostSchema,
  updatePostSchema,
} from "../validators/post.validator";
import { asyncHandler } from "../utils/asyncHandler";

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

  return res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: post,
  });
});

export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID",
    });
  }

  const post = await PostModel.findById(id).populate(
    "author",
    "username name avatar bio",
  );

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: post,
  });
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const id = req.params.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID",
    });
  }

  const parsed = updatePostSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID",
      errors: parsed.error.flatten().fieldErrors,
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
      message: "You can only edit your own posts",
    });
  }

  Object.assign(post, parsed.data);

  await post.save();

  return res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: post,
  });
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const id = req.params.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID",
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
      message: "You can only delete your own posts",
    });
  }

  await PostModel.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});
