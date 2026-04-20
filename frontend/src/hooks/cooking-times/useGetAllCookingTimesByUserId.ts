import type { Recipe } from "@/types/recipe.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { recipeService } from "../../services/recipeService";

export const useGetAllCookingTimesByUserId = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cooking-times", "user", id],
    queryFn: () =>
      recipeService.getAllByUserId(id).then((res) => res.data.data as Recipe[]),
    enabled: !!id,
  });

  const recipes = useMemo(() => data ?? [], [data]);

  return {
    recipes,
    totalRecipes: data?.length ?? 0,
    isLoading,
    error,
  };
};
