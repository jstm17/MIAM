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
      (val) =>
        !val ||
        val instanceof File ||
        val instanceof Blob ||
        val === "remove" ||
        (typeof val === "object" && val !== null && "size" in val),
      "Format invalide",
    )
    .refine(
      (val) =>
        !val ||
        val === "remove" ||
        !("size" in (val as object)) ||
        (val as { size: number }).size <= MAX_FILE_SIZE,
      "L'image ne doit pas dépasser 5Mo",
    )
    .refine(
      (val) =>
        !val ||
        val === "remove" ||
        !("type" in (val as object)) ||
        ACCEPTED_TYPES.includes((val as { type: string }).type),
      "Format accepté : jpg, png, webp",
    )
    .optional(),
});

export type UpdateUserProfileFormData = z.infer<typeof updateUserProfileSchema>;
