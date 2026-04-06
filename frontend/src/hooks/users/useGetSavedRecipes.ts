import type { Recipe } from "@/types/recipe.types";
import { useMemo } from "react";
import { useAuth } from "../useAuth";

export const useGetSavedRecipes = () => {
  const { user, loading } = useAuth();

  const recipes = useMemo<Recipe[]>(() => {
    if (!user?.savedRecipes) return [];
    return user.savedRecipes
      .map((item: any) => {
        const recipe = item.recipe || item;
        if (!recipe) return null;
        return {
          ...recipe,
          savedAt: item.savedAt || item.createdAt,
        };
      })
      .filter((recipe): recipe is Recipe => recipe !== null);
  }, [user]);

  const totalRecipes = recipes.length;

  return { recipes, totalRecipes, loading };
};
