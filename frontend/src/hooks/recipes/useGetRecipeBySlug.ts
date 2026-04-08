import { useEffect, useState } from "react";
import { recipeService } from "../../services/recipeService";
import type { Recipe } from "../../types/recipe.types";

export const useGetRecipeBySlug = (slug: string) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    recipeService
      .getBySlug(slug)
      .then((res) => setRecipe(res.data.data as Recipe))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { recipe, loading, error };
};
