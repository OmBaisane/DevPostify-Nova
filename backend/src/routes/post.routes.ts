import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import {
  toggleReaction,
  getReactionStatus,
} from "../controllers/reaction.controller.js";
import {
  getComments,
  createComment,
} from "../controllers/comment.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

// Public routes with optional authentication awareness
router.get("/", optionalAuth, getPosts);
router.get("/:id", optionalAuth, getPostById);
router.get("/:id/react", optionalAuth, getReactionStatus);
router.get("/:id/comments", optionalAuth, getComments);

// Strictly protected mutation routes
router.post("/", requireAuth, createPost);
router.patch("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);
router.post("/:id/react", requireAuth, toggleReaction);
router.post("/:id/comments", requireAuth, createComment);

export default router;
