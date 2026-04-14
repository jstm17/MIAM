import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est obligatoire")
    .regex(/^[a-zA-ZÀ-ÿ]/, "Le nom doit commencer par une lettre"),
  avatar: z
    .any()
    .transform((val) => {
      if (val instanceof FileList) return val[0];
      return val;
    })
    .refine(
      (val) => !val || val instanceof File || val === "remove",
      "Format invalide",
    )
    .refine(
      (val) => !(val instanceof File) || val.size <= MAX_FILE_SIZE,
      "L'image ne doit pas dépasser 5Mo",
    )
    .refine(
      (val) => !(val instanceof File) || ACCEPTED_TYPES.includes(val.type),
      "Format accepté : jpg, png, webp",
    )
    .optional(),
});

export type UpdateUserProfileFormData = z.infer<typeof updateUserProfileSchema>;
