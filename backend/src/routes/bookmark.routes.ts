import { Router } from "express";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
} from "../controllers/bookmark.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", getBookmarks);
router.post("/:postId", addBookmark);
router.delete("/:postId", removeBookmark);

export default router;
