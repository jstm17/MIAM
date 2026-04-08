import { useEffect, useState } from "react";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types/category.types";

export const useGetCategoryBySlug = (slug: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryService
      .getBySlug(slug)
      .then((res) => setCategory(res.data.data as Category))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { category, loading, error };
};
