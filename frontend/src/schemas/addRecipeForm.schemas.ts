import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const addRecipeSchema = z.object({
  name: z.string().min(1, "Champ requis"),
  timePrep: z
    .number()
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || val >= 0, {
      message: "Le temps doit être supérieure à 0",
    }),
  timeCook: z
    .number()
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || val >= 0, {
      message: "Le temps doit être supérieure à 0",
    }),
  personsNumber: z
    .number()
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || val >= 0, {
      message: "Le nombre de personnes doit être supérieure à 0",
    }),
  categories: z
    .array(z.string(), { error: "Au moins une catégorie est requise" })
    .min(1, "Au moins une catégorie est requise"),
  ingredients: z
    .array(
      z.object({
        ingredient: z.string().min(1, "Champ requis"),
        quantity: z.string().min(1, "Champ requis"),
      }),
    )
    .min(1, "Au moins un ingrédient est requis"),
  instructions: z
    .array(
      z.object({
        content: z.string().min(1, "Champ requis"),
      }),
    )
    .min(1, "Au moins une instruction est requise"),
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

export type AddRecipeFormData = z.infer<typeof addRecipeSchema>;
