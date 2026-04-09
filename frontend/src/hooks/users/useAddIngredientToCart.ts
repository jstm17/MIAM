import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";

export const useAddIngredientToCart = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      recipeId,
      ingredientId,
    }: {
      recipeId: string;
      ingredientId: string;
    }) => userService.addIngredientToCart(recipeId, ingredientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) => {
      console.error("Error adding ingredient to cart:", error);
      throw error;
    },
  });

  const addIngredientToCart = (recipeId: string, ingredientId: string) =>
    mutateAsync({ recipeId, ingredientId });

  return { addIngredientToCart, isPending };
};
