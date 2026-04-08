import { categoryService } from "@/services/categoryService";
import type { Category } from "@/types/category.types";
import { useEffect, useState } from "react";

export const useGetAllCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => {
        setCategories(res.data.data);
        setTotalCategories(res.data.data.length);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, totalCategories, loading, error };
};
