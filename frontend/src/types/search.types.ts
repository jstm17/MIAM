export type RecentSearch = {
  label: string;
  type: "recipe" | "cooking-time" | "category" | "user";
  slug: string;
  addedBy?: string;
  recipesCount?: number;
  cookingTimesCount?: number;
};
