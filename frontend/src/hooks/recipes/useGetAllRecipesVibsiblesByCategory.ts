import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { recipeService } from "../../services/recipeService";
import type { Recipe } from "../../types/recipe.types";

export const useGetAllVisiblesByCategory = (slug: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes", "category", "visibles", slug],
    queryFn: () =>
      recipeService
        .getAllVisiblesByCategory(slug)
        .then((res) => res.data.data as Recipe[]),
    enabled: !!slug,
    staleTime: 0,
  });

  const recipes = useMemo(() => data ?? [], [data]);

  return {
    recipes,
    totalRecipes: data?.length ?? 0,
    isLoading,
    error,
  };
};
