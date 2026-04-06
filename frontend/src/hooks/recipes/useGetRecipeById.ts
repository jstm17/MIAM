import { useEffect, useState } from "react";
import { recipeService } from "../../services/recipeService";
import type { Recipe } from "../../types/recipe.types";

export const useGetRecipeById = (id: string) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    recipeService
      .getById(id)
      .then((res) => setRecipe(res.data.data as Recipe))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { recipe, loading, error };
};
