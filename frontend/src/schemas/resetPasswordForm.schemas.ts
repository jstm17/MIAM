import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(1, "Le mot de passe est obligatoire"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
