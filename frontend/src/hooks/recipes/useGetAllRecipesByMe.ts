import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { recipeService } from "../../services/recipeService";
import type { Recipe } from "../../types/recipe.types";

export const useGetAllRecipesByMe = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes", "me"],
    queryFn: () =>
      recipeService.getAllByMe().then((res) => res.data.data as Recipe[]),
  });

  const recipes = useMemo(() => data ?? [], [data]);

  return {
    recipes,
    totalRecipes: recipes.length,
    isLoading,
    error,
  };
};
