import { categoryService } from "@/services/categoryService";
import { useEffect, useState } from "react";

export const useGetCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => {
        setCategories(res.data.data.map((i: { name: string }) => i.name));
        setTotalCategories(res.data.data.length);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, totalCategories, loading, error };
};
