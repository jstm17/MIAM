import { userService } from "@/services/userService";
import type { UserUpdate } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: UserUpdate) => {
      const formData = new FormData();
      if (payload.name) formData.append("name", payload.name);
      if (payload.avatar instanceof File) {
        formData.append("image", payload.avatar);
      } else if (payload.avatar === "remove") {
        formData.append("removeAvatar", "true");
      }
      return userService.updateUserProfile(formData).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { updateUserProfile: mutateAsync, isPending, error };
};
