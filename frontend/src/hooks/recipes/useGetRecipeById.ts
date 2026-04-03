import { useEffect, useState } from "react";
import { recipeService } from "../../services/recipeService";

export const useGetRecipeById = (id: string) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    recipeService
      .getById(id)
      .then((res) => setRecipe(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { recipe, loading, error };
};
