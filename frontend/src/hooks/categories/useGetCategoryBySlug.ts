import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types/category.types";

export const useGetCategoryBySlug = (slug: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["category", "slug", slug],
    queryFn: () =>
      categoryService.getBySlug(slug).then((res) => res.data.data as Category),
    enabled: !!slug,
  });

  return { category: data ?? null, isLoading, error };
};
