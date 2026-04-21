export type Ingredient = {
  _id: string;
  name: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminIngredient = {
  _id: string;
  name: string;
  url?: string;
  createdAt: string;
  recipesCount: number;
};
