import type { User } from "@/types/user.types";
import { ChefHat, Timer, UtensilsCrossed } from "lucide-react";
import { SearchCommandItem } from "./SearchCommandItem";

type SearchUserItemProps = {
  user: User;
  recipesCount: number;
  cookingTimesCount: number;
  onSelect: () => void;
};

export const SearchUserItem = ({
  user,
  recipesCount,
  cookingTimesCount,
  onSelect,
}: SearchUserItemProps) => (
  <SearchCommandItem
    id={user._id}
    label={user.name}
    icon={<ChefHat className="size-4" />}
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
