import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (val) => val === "" || /^https?:\/\/.+/i.test(val),
    "Must be a valid URL starting with http:// or https://",
  )
  .optional();

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(60, "Name cannot exceed 60 characters")
    .optional(),
  bio: z
    .string()
    .trim()
    .max(300, "Bio cannot exceed 300 characters")
    .optional(),
  avatar: optionalUrl,
  skills: z
    .array(z.string().trim().max(25, "Skill name too long"))
    .max(15, "You can add up to 15 skills")
    .optional(),
  specialties: z
    .array(z.string().trim().max(30, "Specialty name too long"))
    .max(5, "You can add up to 5 specialties")
    .optional(),
  socials: z
    .object({
      github: optionalUrl,
      linkedin: optionalUrl,
      website: optionalUrl,
    })
    .optional(),
});
