import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../controllers/post.controller";
import {
  toggleReaction,
  getReactionStatus,
} from "../controllers/reaction.controller.js";
import {
  getComments,
  createComment,
} from "../controllers/comment.controller.js";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", getPosts);
router.post("/", requireAuth, createPost);
router.get("/:id", getPostById);
router.patch("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

router.get("/:id/react", getReactionStatus);
router.post("/:id/react", requireAuth, toggleReaction);
router.get("/:id/comments", getComments);
router.post("/:id/comments", requireAuth, createComment);

export default router;
