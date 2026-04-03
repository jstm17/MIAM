import type { Recipe } from "./recipe.types";

export type User = {
  _id: string;
  name: string;
  savedRecipes: Recipe[];
  createdAt: string;
  updatedAt: string;
};
