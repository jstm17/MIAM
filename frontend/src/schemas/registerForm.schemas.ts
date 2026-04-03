import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est obligatoire")
    .regex(/^[a-zA-ZÀ-ÿ]/, "Le nom doit commencer par une lettre"),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
