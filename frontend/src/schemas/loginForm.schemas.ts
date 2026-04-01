import { z } from "zod";

export const loginSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
