import { useMemo } from "react";
import { useAuth } from "../useAuth";
import type { Recipe } from "@/types/recipe.types";

export const useGetSavedRecipes = () => {
  const { user, loading } = useAuth();

  const recipes = useMemo<Recipe[]>(() => user?.savedRecipes ?? [], [user]);

  const totalRecipes = recipes.length;

  return { recipes, totalRecipes, loading };
};
