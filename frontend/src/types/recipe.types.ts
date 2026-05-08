import type { Category } from "./category.types";
import type { Ingredient } from "./ingredient.types";
import type { User } from "./user.types";

export type RecipeIngredient = {
  ingredient: Ingredient;
  quantity: string;
  label?: string;
};

export type RecipeInstruction = {
  content: string;
};

export type Recipe = {
  _id: string;
  name: string;
  slug: string;
  ingredients: RecipeIngredient[];
  timePrep: number;
  timeCook: number;
  categories: Category[];
  instructions: RecipeInstruction[];
  personsNumber: number;
  addedBy: User;
  image: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  savedAt?: string;
};

export type AdminRecipe = {
  _id: string;
  name: string;
  slug: string;
  ingredients: RecipeIngredient[];
  timePrep: number;
  timeCook: number;
  categories: string[];
  instructions: RecipeInstruction[];
  personsNumber: number;
  visible: boolean;
  addedBy: User;
  createdAt: string;
};
