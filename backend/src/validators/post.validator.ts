import z, { trim } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(160, "Title cannot exceed 160 characters"),

  content: z.string().min(1, "Content is required"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category cannot exceed 50 characters"),

  tags: z
    .array(z.string().trim().min(1).max(30))
    .max(10, "Maximum 10 tags are allowed")
    .default([]),

  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export const updatePostSchema = createPostSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type createPostInput = z.infer<typeof createPostSchema>;
export type updatePostSchema = z.infer<typeof updatePostSchema>;
