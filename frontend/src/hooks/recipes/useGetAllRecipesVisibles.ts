import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { recipeService } from "../../services/recipeService";
import type { Recipe } from "../../types/recipe.types";

export const useGetAllRecipesVisibles = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes", "visibles"],
    queryFn: () =>
      recipeService.getAllVisibles().then((res) => res.data.data as Recipe[]),
    staleTime: 0,
  });

  const recipes = useMemo(() => data ?? [], [data]);

  return {
    recipes,
    totalRecipes: recipes.length,
    isLoading,
    error,
  };
};
