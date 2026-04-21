import { ingredientService } from "@/services/ingredientService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useResetIngredientUrl = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: string) =>
      ingredientService.resetUrl(id).then((res) => res.data.data),
    onSuccess: (updatedIngredient) => {
      // Invalider la query pour refetch les ingrédients
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      // Optionnel: mettre à jour le cache directement
      queryClient.setQueryData(
        ["ingredient", updatedIngredient._id],
        updatedIngredient,
      );
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { resetUrl: mutateAsync, isPending, error };
};
