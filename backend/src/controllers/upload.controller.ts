import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const ALLOWED_FOLDERS = new Set(["devpostify/covers", "devpostify/avatars"]);

// @desc    Generate signed params for secure direct upload to Cloudinary
// @route   POST /api/upload/signature
// @access  Private
export const getUploadSignature = asyncHandler(
  async (req: Request, res: Response) => {
    if (!env.CLOUDINARY_API_SECRET || !env.CLOUDINARY_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "Media storage is not configured on the server",
      });
    }

    const rawFolder =
      typeof req.body.folder === "string"
        ? req.body.folder.trim()
        : "devpostify/covers";

    // Strict folder boundary whitelist
    const folder = ALLOWED_FOLDERS.has(rawFolder)
      ? rawFolder
      : "devpostify/covers";
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      env.CLOUDINARY_API_SECRET,
    );

    return sendSuccess(res, 200, "Upload signature generated", {
      signature,
      timestamp,
      folder,
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
    });
  },
);
