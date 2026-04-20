import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { recipeService } from "../../services/recipeService";
import type { Recipe } from "../../types/recipe.types";

export const useGetAllCookingTimesByCategory = (slug: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cooking-times", "category", slug],
    queryFn: () =>
      recipeService
        .getAllByCategory(slug)
        .then((res) => res.data.data as Recipe[]),
    enabled: !!slug,
  });

  const recipes = useMemo(() => data ?? [], [data]);

  return {
    recipes,
    totalRecipes: data?.length ?? 0,
    isLoading,
    error,
  };
};
