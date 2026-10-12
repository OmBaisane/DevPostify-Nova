import { z } from "zod";

const ALLOWED_CATEGORIES = [
  "webdev",
  "architecture",
  "devops",
  "opensource",
  "ai",
] as const;

// Normalize, lowercase, deduplicate, and limit tags safely
const tagsSchema = z
  .array(
    z
      .string()
      .trim()
      .toLowerCase()
      .max(30, "Tag cannot exceed 30 characters")
      .regex(
        /^[a-z0-9-_]+$/,
        "Tags can only contain alphanumeric characters, hyphens, and underscores",
      ),
  )
  .transform((tags) => Array.from(new Set(tags.filter(Boolean))).slice(0, 5))
  .default([]);

const urlOrEmptySchema = z
  .string()
  .trim()
  .max(500, "Cover image URL too long")
  .refine(
    (val) => !val || val.startsWith("https://") || val.startsWith("http://"),
    "Cover image must be a valid HTTP or HTTPS URL",
  )
  .default("");

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(160, "Title cannot exceed 160 characters"),
  content: z
    .string()
    .trim()
    .min(20, "Content must be at least 20 characters")
    .max(100000, "Content exceeds maximum length"),
  category: z.enum(ALLOWED_CATEGORIES, {
    message: "Invalid category selection",
  }),
  tags: tagsSchema,
  coverImage: urlOrEmptySchema,
  isDraft: z.boolean().default(false),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(160, "Title cannot exceed 160 characters")
    .optional(),
  content: z
    .string()
    .trim()
    .min(20, "Content must be at least 20 characters")
    .max(100000, "Content exceeds maximum length")
    .optional(),
  category: z
    .enum(ALLOWED_CATEGORIES, {
      message: "Invalid category selection",
    })
    .optional(),
  tags: tagsSchema.optional(),
  coverImage: urlOrEmptySchema.optional(),
  isDraft: z.boolean().optional(),
});
