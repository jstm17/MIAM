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

export type AdminCategory = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  recipesCount?: number;
  cookingTimesCount?: number;
};
