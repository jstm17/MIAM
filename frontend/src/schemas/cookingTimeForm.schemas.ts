import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const cookingTimeSchema = z.object({
  name: z.string().min(1, "Champ requis"),
  device: z.string().optional(),
  degreeCook: z
    .number()
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || val >= 0, {
      message: "La température doit être supérieure à 0",
    }),
  timeCook: z
    .number()
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || val >= 0, {
      message: "Le temps doit être supérieure à 0",
    }),
  methodCook: z.string().optional(),
  notes: z.string().optional(),
  categories: z
    .array(z.string(), { error: "Au moins une catégorie est requise" })
    .min(1, "Au moins une catégorie est requise"),
  image: z
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
        typeof val === "string" ||
        (typeof val === "object" && val !== null && "size" in val),
      "Format invalide",
    )
    .refine(
      (val) =>
        !val ||
        typeof val === "string" ||
        !("size" in (val as object)) ||
        (val as { size: number }).size <= MAX_FILE_SIZE,
      "L'image ne doit pas dépasser 5Mo",
    )
    .refine(
      (val) =>
        !val ||
        typeof val === "string" ||
        !("type" in (val as object)) ||
        ACCEPTED_TYPES.includes((val as { type: string }).type),
      "Format accepté : jpg, png, webp",
    )
    .optional(),
  visible: z.boolean(),
});

export type CookingTimeFormData = z.infer<typeof cookingTimeSchema>;
