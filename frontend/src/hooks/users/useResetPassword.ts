import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../lib/axiosInstance";

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await api.post("/users/reset-password", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Mot de passe réinitialisé avec succès");
      navigate("/login");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        err?.response?.data?.message || "Erreur lors de la réinitialisation",
      );
    },
  });
};
