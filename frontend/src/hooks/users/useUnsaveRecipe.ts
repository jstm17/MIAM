import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";

export const useUnsaveRecipe = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (recipeId: string) => userService.unsaveRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["recettes"] });
      queryClient.invalidateQueries({ queryKey: ["recette"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
    onError: (error) => {
      console.error("Error unsaving recipe:", error);
    },
  });

  return {
    unsaveRecipe: mutateAsync,
    isPending,
  };
};
