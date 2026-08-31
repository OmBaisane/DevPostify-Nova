import { Router } from "express";
import { sendSuccess } from "../utils/apiResponse";

const router = Router();

router.get("/", (_req, res) => {
  return sendSuccess(res, 200, "DevPostify Nova API is healthy", {
    environment: process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
  });
});

export default router;
