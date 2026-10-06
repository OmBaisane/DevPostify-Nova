import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Initialize Cloudinary instance
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Generates an authenticated signature for direct client-to-Cloudinary uploads.
 * Restricts folder and timestamps to prevent signature tampering.
 */
export const getUploadSignature = asyncHandler(
  async (req: Request, res: Response) => {
    if (!env.CLOUDINARY_API_SECRET || !env.CLOUDINARY_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "Media storage is not configured on the server",
      });
    }

    const { folder = "devpostify/avatars" } = req.body;

    // Strict folder whitelist to avoid bucket abuse
    const allowedFolders = ["devpostify/avatars", "devpostify/covers"];
    const targetFolder = allowedFolders.includes(folder)
      ? folder
      : "devpostify/avatars";

    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: targetFolder,
      },
      env.CLOUDINARY_API_SECRET,
    );

    return sendSuccess(res, 200, "Upload signature generated", {
      timestamp,
      signature,
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      folder: targetFolder,
    });
  },
);
