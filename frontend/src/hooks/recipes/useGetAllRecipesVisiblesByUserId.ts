import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { recipeService } from "../../services/recipeService";
import type { Recipe } from "../../types/recipe.types";

export const useGetAllRecipesVisiblesByUserId = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes", "user", "visibles", id],
    queryFn: () =>
      recipeService
        .getAllByUserId(id)
        .then((res) =>
          (res.data.data as Recipe[]).filter((recipe) => recipe.visible),
        ),
    enabled: !!id,
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
