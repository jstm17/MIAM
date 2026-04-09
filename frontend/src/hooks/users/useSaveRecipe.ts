import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";

export const useSaveRecipe = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (recipeId: string) => userService.saveRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) => {
      console.error("Error saving recipe:", error);
    },
  });

  return {
    saveRecipe: mutateAsync,
    isPending,
  };
};
