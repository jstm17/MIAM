import { useQuery } from "@tanstack/react-query";
import { recipeService } from "../../services/recipeService";
import type { Recipe } from "../../types/recipe.types";

export const useGetRecipeById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe", "id", id],
    queryFn: () =>
      recipeService.getById(id).then((res) => res.data.data as Recipe),
    enabled: !!id,
  });

  return { recipe: data ?? null, isLoading, error };
};
