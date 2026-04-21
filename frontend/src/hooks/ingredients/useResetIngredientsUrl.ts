import type { Ingredient } from "@/types/ingredient.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ingredientService } from "../../services/ingredientService";

export const useResetIngredientsUrl = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (ids: string[]) =>
      ingredientService.resetUrlMany(ids).then((res) => res.data.data),
    onSuccess: (updatedIngredients) => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      // Optionnel: mettre à jour le cache directement
      updatedIngredients?.forEach((ingredient: Ingredient) => {
        queryClient.setQueryData(["ingredient", ingredient._id], ingredient);
      });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { resetUrlMany: mutateAsync, isPending };
};
