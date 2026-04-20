export type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  recipesCount?: number;
  cookingTimesCount?: number;
};

export type CreateCategoryDto = {
  name: string;
  slug: string;
  image: string;
};
