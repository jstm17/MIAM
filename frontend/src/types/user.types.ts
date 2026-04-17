import type { Ingredient } from "./ingredient.types";
import type { Product } from "./product.types";
import type { Recipe } from "./recipe.types";

export type SavedRecipe = {
  recipe: Recipe;
  savedAt: string;
};

export type SavedIngredient = {
  ingredient: Ingredient;
  recipe?: Recipe;
  addedAt: string;
};

export type User = {
  _id: string;
  name: string;
  slug?: string;
  avatar: string;
  savedRecipes?: SavedRecipe[];
  savedIngredients?: SavedIngredient[];
  createdAt?: string;
  updatedAt?: string;
  recipesCount?: number;
  savedProducts?: Product[];
  role: "user" | "admin";
};

export type UserUpdate = {
  name?: string;
  avatar?: File | Blob | string;
  currentPassword?: string;
  newPassword?: string;
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  recipesCount: number;
  createdAt: string;
};
