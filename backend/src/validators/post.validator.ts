import { z } from "zod";

export const V1_CATEGORIES = [
  "webdev",
  "architecture",
  "devops",
  "opensource",
  "ai",
] as const;

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(160, "Title cannot exceed 160 characters"),
  content: z
    .string()
    .trim()
    .min(20, "Post content must be at least 20 characters"),
  category: z.enum(["webdev", "architecture", "devops", "opensource", "ai"], {
    message: "Please select a valid engineering category",
  }),
  tags: z
    .array(z.string().trim().toLowerCase())
    .max(5, "You can specify up to 5 tags")
    .default([]),
});

export const updatePostSchema = createPostSchema.partial();
