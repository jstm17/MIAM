import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { recipeService } from "../../services/recipeService";

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: string) =>
      recipeService.delete(id).then((res) => res.data),
    onSuccess: (_, id) => {
      const invalidate = (queryKey: string[]) =>
        queryClient.invalidateQueries({ queryKey, exact: false });

      invalidate(["recipes"]);
      invalidate(["recipe"]);
      invalidate(["recipes", "category"]);
      invalidate(["recipes", "category", "visibles"]);
      invalidate(["recipes", "user"]);
      invalidate(["recipes", "user", "visibles"]);
      invalidate(["recipes", "me"]);
      invalidate(["recipes", "visibles"]);
      invalidate(["categories"]);
      invalidate(["users"]);
      invalidate(["user"]);
      invalidate(["me"]);
      invalidate(["ingredients"]);

      queryClient.removeQueries({ queryKey: ["recipe", "id", id], exact: false });
      queryClient.removeQueries({ queryKey: ["recipe", "slug"], exact: false });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { deleteRecipe: mutateAsync, isPending, error };
};
