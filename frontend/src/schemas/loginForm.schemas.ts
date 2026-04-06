import { z } from "zod";

export const loginSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est obligatoire")
    .regex(/^[a-zA-ZÀ-ÿ]/, "Le nom doit commencer par une lettre"),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
