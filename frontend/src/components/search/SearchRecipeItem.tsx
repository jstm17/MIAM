import type { Recipe } from "@/types/recipe.types";
import { UserRound, UtensilsCrossed } from "lucide-react";
import { SearchCommandItem } from "./SearchCommandItem";

type SearchRecipeItemProps = {
  recipe: Recipe;
  onSelect: () => void;
};

export const SearchRecipeItem = ({
  recipe,
  onSelect,
}: SearchRecipeItemProps) => (
  <SearchCommandItem
    id={recipe._id}
    label={recipe.name}
    icon={<UtensilsCrossed className="size-4" />}
    metaRecipe={{
      icon: <UserRound className="size-3" strokeWidth={1} />,
      value: recipe.addedBy?.name ?? "",
    }}
    onSelect={onSelect}
  />
);
