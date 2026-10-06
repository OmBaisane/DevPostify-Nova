import { api, ApiError } from "./api";

interface SignatureResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/**
 * Uploads an image file directly to Cloudinary using a backend-authorized signature.
 * Prevents routing file buffers through the Express API server.
 */
export async function uploadImageDirect(
  file: File,
  folder: "devpostify/avatars" | "devpostify/covers" = "devpostify/avatars",
): Promise<string> {
  // 1. File size validation (Max 2MB for avatars, 5MB for covers)
  const maxBytes =
    folder === "devpostify/avatars" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    const limitMB = maxBytes / (1024 * 1024);
    throw new Error(`File size exceeds maximum allowed limit of ${limitMB}MB`);
  }

  // 2. Format validation
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are supported");
  }

  // 3. Obtain authorization signature from backend
  const sigRes = await api.post<SignatureResponse>("/upload/signature", {
    folder,
  });
  if (!sigRes.data) {
    throw new Error(sigRes.message || "Failed to initialize upload signature");
  }

  const {
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder: targetFolder,
  } = sigRes.data;

  // 4. Direct multipart upload to Cloudinary Edge
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", targetFolder);

  const uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Failed to upload image to CDN");
  }

  return data.secure_url as string;
}
