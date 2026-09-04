import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostById,
  updatePost,
} from "../controllers/post.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, createPost);
router.get("/:id", getPostById);
router.patch("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

export default router;
