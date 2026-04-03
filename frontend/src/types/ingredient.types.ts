export type Ingredient = {
  _id: string;
  name: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateIngredientDto = {
  name: string;
  url?: string;
};
