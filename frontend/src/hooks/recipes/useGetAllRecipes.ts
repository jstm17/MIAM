import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { recipeService } from "../../services/recipeService";
import type { Recipe } from "../../types/recipe.types";

export const useGetAllRecipes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes"],
    queryFn: () =>
      recipeService.getAll().then((res) => res.data.data as Recipe[]),
  });

  const recipes = useMemo(() => data ?? [], [data]);

  return {
    recipes,
    totalRecipes: data?.length ?? 0,
    isLoading,
    error,
  };
};
