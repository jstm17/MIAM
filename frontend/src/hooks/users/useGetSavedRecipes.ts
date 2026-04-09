import type { Recipe } from "@/types/recipe.types";
import type { SavedRecipe } from "@/types/user.types";
import { useMemo } from "react";
import { useAuth } from "../useAuth";

type RecipeWithSavedAt = Recipe & { savedAt: string };

export const useGetSavedRecipes = () => {
  const { user, isLoading } = useAuth();

  const recipes = useMemo<RecipeWithSavedAt[]>(() => {
    if (!user?.savedRecipes) return [];
    return user.savedRecipes
      .map((item: SavedRecipe) => {
        if (!item.recipe) return null;
        return {
          ...item.recipe,
          savedAt: item.savedAt,
        } as RecipeWithSavedAt;
      })
      .filter((recipe): recipe is RecipeWithSavedAt => recipe !== null);
  }, [user]);

  return { recipes, totalRecipes: recipes.length, isLoading };
};
