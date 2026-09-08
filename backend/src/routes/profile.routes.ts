import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/:username", getProfile);
router.patch("/", requireAuth, updateProfile);

export default router;
