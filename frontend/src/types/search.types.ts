export type RecentSearch = {
  label: string;
  type: "recipe" | "category" | "user";
  slug: string;
  addedBy?: string;
  recipesCount?: number;
};
