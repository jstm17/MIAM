import type { Category } from "./category.types";
import type { Ingredient } from "./ingredient.types";
import type { User } from "./user.types";

export type RecipeIngredient = {
  ingredient: Ingredient;
  quantity: string;
};

export type RecipeInstruction = {
  content: string;
};

export type Recipe = {
  _id: string;
  name: string;
  slug: string;
  ingredients: RecipeIngredient[];
  time: number;
  categories: Category[];
  instructions: RecipeInstruction[];
  personsNumber: number;
  addedBy: User;
  image: string;
  createdAt: string;
  updatedAt: string;
  savedAt?: string; // Optional timestamp for when recipe was saved
};

export type CreateRecipeDto = {
  name: string;
  ingredients: RecipeIngredient[];
  time: number;
  categories: string[]; // ids
  instructions: RecipeInstruction[];
  personsNumber: number;
};

export type UpdateRecipeDto = Partial<CreateRecipeDto>;
