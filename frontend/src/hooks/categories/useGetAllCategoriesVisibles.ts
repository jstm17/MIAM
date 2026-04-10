import { categoryService } from "@/services/categoryService";
import type { Category } from "@/types/category.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetAllCategoriesVisibles = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories", "visibles"],
    queryFn: () =>
      categoryService
        .getAllVisibles()
        .then((res) => res.data.data as Category[]),
    staleTime: 0,
  });

  const categories = useMemo(() => data ?? [], [data]);

  return {
    categories,
    totalCategories: categories.length,
    isLoading,
    error,
  };
};
