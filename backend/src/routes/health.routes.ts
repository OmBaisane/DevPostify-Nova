import { Router } from "express";
import { sendSuccess } from "../utils/apiResponse";

const router = Router();

/**
 * Health check probe utilized by Render and edge pingers.
 * Omits internal runtime variables to eliminate information disclosure.
 */
router.get("/", (_req, res) => {
  return sendSuccess(res, 200, "DevPostify Nova API is healthy", {
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
