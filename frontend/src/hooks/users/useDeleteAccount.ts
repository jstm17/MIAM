import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userService } from "../../services/userService";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: () => userService.deleteAccount().then((res) => res.data),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { deleteUser: mutateAsync, isPending, error };
};
