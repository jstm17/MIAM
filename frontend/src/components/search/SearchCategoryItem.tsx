import type { Category } from "@/types/category.types";
import { Tag, Timer, UtensilsCrossed } from "lucide-react";
import { SearchCommandItem } from "./SearchCommandItem";

type SearchCategoryItemProps = {
  category: Category;
  recipesCount: number;
  cookingTimesCount: number;
  onSelect: () => void;
};

export const SearchCategoryItem = ({
  category,
  recipesCount,
  cookingTimesCount,
  onSelect,
}: SearchCategoryItemProps) => (
  <SearchCommandItem
    id={category._id}
    label={category.name}
    icon={<Tag className="size-4" />}
    metaRecipe={{
      icon: <UtensilsCrossed className="size-3" strokeWidth={1} />,
      value: recipesCount,
    }}
    metaCookingTime={{
      icon: <Timer className="size-3" strokeWidth={1} />,
      value: cookingTimesCount,
    }}
    onSelect={onSelect}
  />
);
