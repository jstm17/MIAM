import type { Category } from "@/types/category.types";
import { Tag, UtensilsCrossed } from "lucide-react";
import { SearchCommandItem } from "./SearchCommandItem";

type SearchCategoryItemProps = {
  category: Category;
  recipesCount: number;
  onSelect: () => void;
};

export const SearchCategoryItem = ({
  category,
  recipesCount,
  onSelect,
}: SearchCategoryItemProps) => (
  <SearchCommandItem
    id={category._id}
    label={category.name}
    icon={<Tag className="size-4" />}
    meta={{
      icon: <UtensilsCrossed className="size-3" strokeWidth={1} />,
      value: recipesCount,
    }}
    onSelect={onSelect}
  />
);
