import { Router } from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

router.get("/:username", optionalAuth, getProfile);
router.patch("/", requireAuth, updateProfile);

export default router;
