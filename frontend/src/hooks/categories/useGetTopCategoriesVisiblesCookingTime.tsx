import { categoryService } from "@/services/categoryService";
import type { Category } from "@/types/category.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetTopCategoriesVisiblesCookingTimes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories", "top"],
    queryFn: () =>
      categoryService
        .getTopVisiblesCookingTimes()
        .then((res) => res.data.data as Category[]),
    staleTime: 0,
  });

  const categories = useMemo(() => {
    const sorted = [...(data ?? [])]
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => (b.cookingTimesCount ?? 0) - (a.cookingTimesCount ?? 0));
    return sorted.slice(0, 10);
  }, [data]);

  return {
    categories,
    totalCategories: categories.length,
    isLoading,
    error,
  };
};
