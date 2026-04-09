import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";

export const useRemoveIngredientFromCart = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      recipeId,
      ingredientId,
    }: {
      recipeId: string;
      ingredientId: string;
    }) => userService.removeIngredientFromCart(recipeId, ingredientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) => {
      console.error("Error removing ingredient from cart:", error);
      throw error;
    },
  });

  const removeIngredientFromCart = (recipeId: string, ingredientId: string) =>
    mutateAsync({ recipeId, ingredientId });

  return { removeIngredientFromCart, isPending };
};
