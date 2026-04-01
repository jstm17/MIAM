import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
