import { categoryService } from "@/services/categoryService";
import type { AdminCategory } from "@/types/category.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetAllCategories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      categoryService.getAll().then((res) => res.data.data as AdminCategory[]),
    staleTime: 0,
  });

  const categories = useMemo(() => data ?? [], [data]);

  return {
    categories,
    totalCategories: data?.length ?? 0,
    isLoading,
    error,
  };
};
