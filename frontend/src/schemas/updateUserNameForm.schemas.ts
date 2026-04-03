import { z } from "zod";

export const updateUserNameSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est obligatoire")
    .regex(/^[a-zA-ZÀ-ÿ]/, "Le nom doit commencer par une lettre"),
});

export type UpdateUserNameFormData = z.infer<typeof updateUserNameSchema>;
