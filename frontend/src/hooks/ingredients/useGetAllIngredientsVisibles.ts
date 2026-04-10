import { ingredientService } from "@/services/ingredientService";
import type { Ingredient } from "@/types/ingredient.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetAllIngredientsVisibles = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ingredients", "visibles"],
    queryFn: () =>
      ingredientService
        .getAllVisibles()
        .then((res) => res.data.data as Ingredient[]),
    staleTime: 0,
  });

  const ingredients = useMemo(() => data ?? [], [data]);

  return {
    ingredients,
    totalIngredients: ingredients.length,
    isLoading,
    error,
  };
};
