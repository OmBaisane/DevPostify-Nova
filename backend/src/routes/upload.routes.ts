import { Router } from "express";
import { getUploadSignature } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Only authenticated users can request an upload signature
router.post("/signature", requireAuth, getUploadSignature);

export default router;
