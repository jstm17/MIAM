import { userService } from "@/services/userService";
import type { UserUpdate } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (payload: UserUpdate) => {
      const formData = new FormData();
      if (payload.name) formData.append("name", payload.name);
      if (
        payload.avatar instanceof File ||
        payload.avatar instanceof Blob ||
        (typeof payload.avatar === "object" &&
          payload.avatar !== null &&
          "size" in payload.avatar)
      ) {
        formData.append("image", payload.avatar as Blob);
      } else if (payload.avatar === "remove") {
        formData.append("removeAvatar", "true");
      }

      if (payload.currentPassword) {
        formData.append("currentPassword", payload.currentPassword);
      }
      if (payload.newPassword) {
        formData.append("newPassword", payload.newPassword);
      }

      try {
        const res = await userService.updateUserProfile(formData);
        return res.data;
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        throw new Error(
          axiosError.response?.data?.message || axiosError.message,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  return { updateUserProfile: mutateAsync, isPending, error };
};
