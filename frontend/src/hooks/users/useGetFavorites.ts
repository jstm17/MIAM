import type { CookingTime } from "@/types/cookingTime.types";
import type { Recipe } from "@/types/recipe.types";
import type { SavedCookingTime, SavedRecipe } from "@/types/user.types";
import { useMemo } from "react";
import { useAuth } from "../useAuth";

type RecipeWithSavedAt = Recipe & { savedAt: string };
type CookingTimeWithSavedAt = CookingTime & { savedAt: string };

export const useGetFavorites = () => {
  const { user, isLoading } = useAuth();

  const { recipes, totalRecipes } = useMemo(() => {
    if (!user?.savedRecipes) return { recipes: [], totalRecipes: 0 };

    const items = user.savedRecipes
      .map((item: SavedRecipe) => {
        if (!item.recipe) return null;
        return {
          ...item.recipe,
          savedAt: item.savedAt,
        } as RecipeWithSavedAt;
      })
      .filter((recipe): recipe is RecipeWithSavedAt => {
        if (!recipe) return false;

        const isOwner = recipe.addedBy?._id === user._id;
        return isOwner || recipe.visible;
      });

    return { recipes: items, totalRecipes: items.length };
  }, [user]);

  const { cookingTimes, totalCookingTimes } = useMemo(() => {
    if (!user?.savedCookingTimes)
      return { cookingTimes: [], totalCookingTimes: 0 };

    const items = user.savedCookingTimes
      .map((item: SavedCookingTime) => {
        if (!item.cookingTime) return null;
        return {
          ...item.cookingTime,
          savedAt: item.savedAt,
        } as CookingTimeWithSavedAt;
      })
      .filter((cookingTime): cookingTime is CookingTimeWithSavedAt => {
        if (!cookingTime) return false;

        const isOwner = cookingTime.addedBy?._id === user._id;
        return isOwner || cookingTime.visible;
      });

    return { cookingTimes: items, totalCookingTimes: items.length };
  }, [user]);

  return {
    recipes,
    totalRecipes,
    cookingTimes,
    totalCookingTimes,
    total: totalRecipes + totalCookingTimes,
    isLoading,
  };
};
