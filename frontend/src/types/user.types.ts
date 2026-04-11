import type { Ingredient } from "./ingredient.types";
import type { Recipe } from "./recipe.types";

export type SavedRecipe = {
  recipe: Recipe;
  savedAt: string;
};

export type SavedIngredient = {
  ingredient: Ingredient;
  recipe: Recipe;
  addedAt: string;
};

export type User = {
  _id: string;
  name: string;
  slug?: string;
  savedRecipes?: SavedRecipe[];
  savedIngredients?: SavedIngredient[];
  createdAt?: string;
  updatedAt?: string;
  recipeCount?: number;
};
