import { ingredientService } from "@/services/ingredientService";
import { useEffect, useState } from "react";

export const useGetAllIngredients = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [totalIngredients, setTotalIngredients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ingredientService
      .getAll()
      .then((res) => {
        setIngredients(res.data.data.map((i: { name: string }) => i.name));
        setTotalIngredients(res.data.data.length);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { ingredients, totalIngredients, loading, error };
};
