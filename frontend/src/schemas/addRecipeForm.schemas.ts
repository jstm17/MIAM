import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const addRecipeSchema = z.object({
  name: z.string().min(1, "Champ requis"),
  time: z
    .number({ error: "Champ requis" })
    .min(1, "La durée doit être supérieure à 0"),
  personsNumber: z
    .number({ error: "Champ requis" })
    .min(1, "Le nombre de personnes doit être supérieur à 0"),
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
    .union([z.instanceof(File), z.string()])
    .optional()
    .refine((file) => !(file instanceof File) || file.size <= MAX_FILE_SIZE, {
      message: "L'image ne doit pas dépasser 5Mo",
    })
    .refine(
      (file) => !(file instanceof File) || ACCEPTED_TYPES.includes(file.type),
      {
        message: "Format accepté : jpg, png, webp",
      },
    ),
});

export type AddRecipeFormData = z.infer<typeof addRecipeSchema>;
