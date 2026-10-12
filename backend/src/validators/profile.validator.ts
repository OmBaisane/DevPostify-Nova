import { z } from "zod";

const safeUrlSchema = z
  .string()
  .trim()
  .max(250, "URL too long")
  .refine(
    (val) => !val || val.startsWith("https://") || val.startsWith("http://"),
    "Link must be a valid HTTP or HTTPS URL",
  )
  .optional()
  .default("");

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters")
    .optional(),
  bio: z
    .string()
    .trim()
    .max(300, "Bio cannot exceed 300 characters")
    .optional()
    .default(""),
  avatar: safeUrlSchema,
  skills: z
    .array(z.string().trim().max(30, "Skill label too long"))
    .transform((skills) =>
      Array.from(new Set(skills.filter(Boolean))).slice(0, 15),
    )
    .optional()
    .default([]),
  specialties: z
    .array(z.string().trim().max(30, "Specialty label too long"))
    .transform((spec) => Array.from(new Set(spec.filter(Boolean))).slice(0, 5))
    .optional()
    .default([]),
  socials: z
    .object({
      github: safeUrlSchema,
      linkedin: safeUrlSchema,
      website: safeUrlSchema,
    })
    .optional()
    .default({ github: "", linkedin: "", website: "" }),
});
