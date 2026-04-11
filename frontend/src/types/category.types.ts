export type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  recipeCount?: number;
};

export type CreateCategoryDto = {
  name: string;
  slug: string;
  image: string;
};
