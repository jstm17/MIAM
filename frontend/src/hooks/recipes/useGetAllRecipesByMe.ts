import type { Recipe } from "@/types/recipe.types";
import { useEffect, useState } from "react";
import { recipeService } from "../../services/recipeService";

export const useGetAllRecipesByMe = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalRecipes, setTotalRecipes] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    recipeService
      .getAllByMe()
      .then((res) => {
        setRecipes(res.data.data);
        setTotalRecipes(res.data.data.length);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { recipes, setRecipes, totalRecipes, setTotalRecipes, loading, error };
};
