import { adminService } from "@/services/adminService";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useResetPasswordAdmin = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminService.resetPassword(id);
      return res.data.data.resetLink;
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { resetPassword: mutateAsync, isPending, error };
};
