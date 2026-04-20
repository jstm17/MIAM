import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { recipeService } from "../../services/recipeService";
import type { Recipe } from "../../types/recipe.types";

export const useGetAllCookingTimes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cooking-times"],
    queryFn: () =>
      recipeService.getAll().then((res) => res.data.data as Recipe[]),
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
