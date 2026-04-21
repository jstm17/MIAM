import { ingredientService } from "@/services/ingredientService";
import type { AdminIngredient } from "@/types/ingredient.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
export const useGetAllIngredients = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () =>
      ingredientService
        .getAll()
        .then((res) => res.data.data as AdminIngredient[]),
    staleTime: 0,
  });

  const ingredients = useMemo(() => data ?? [], [data]);

  return {
    ingredients,
    totalIngredients: data?.length ?? 0,
    isLoading,
    error,
  };
};
