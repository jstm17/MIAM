import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { cookingTimeService } from "../../services/cookingTimeService";

export const useDeleteCookingTime = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: string) =>
      cookingTimeService.delete(id).then((res) => res.data),
    onSuccess: (_, id) => {
      const invalidate = (queryKey: string[]) =>
        queryClient.invalidateQueries({ queryKey, exact: false });

      invalidate(["cooking-times"]);
      invalidate(["cookingTime"]);
      invalidate(["cooking-times", "category"]);
      invalidate(["cooking-times", "category", "visibles"]);
      invalidate(["cooking-times", "user"]);
      invalidate(["cooking-times", "user", "visibles"]);
      invalidate(["cooking-times", "me"]);
      invalidate(["cooking-times", "visibles"]);
      invalidate(["categories"]);
      invalidate(["users"]);
      invalidate(["user"]);
      invalidate(["me"]);
      invalidate(["ingredients"]);

      queryClient.removeQueries({
        queryKey: ["cooking-time", "id", id],
        exact: false,
      });
      queryClient.removeQueries({
        queryKey: ["cookingTime", "slug"],
        exact: false,
      });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { deleteCookingTime: mutateAsync, isPending, error };
};
