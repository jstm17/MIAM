import type { Category } from "./category.types";
import type { User } from "./user.types";

export type CookingTime = {
  _id: string;
  name: string;
  slug: string;
  device: string;
  degreeCook: number;
  timeCook: number;
  methodCook: string;
  notes: string;
  categories: Category[];
  image: string;
  visible: boolean;
  addedBy: User;
  createdAt: string;
  updatedAt: string;
  savedAt?: string;
};
