import { userService } from "@/services/userService";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const useUpdatePassword = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: UpdatePasswordPayload) =>
      userService.updatePassword(payload).then((res) => res.data),
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { updatePassword: mutateAsync, isPending, error };
};
