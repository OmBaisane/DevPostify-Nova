import { Router } from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getNotifications);
router.get("/unread-count", requireAuth, getUnreadCount);
router.patch("/read-all", requireAuth, markAllAsRead);
router.patch("/:id/read", requireAuth, markAsRead);

export default router;
