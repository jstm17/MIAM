import type { User } from "@/types/user.types";
import { ChefHat, UtensilsCrossed } from "lucide-react";
import { SearchCommandItem } from "./SearchCommandItem";

type SearchUserItemProps = {
  user: User;
  recipesCount: number;
  onSelect: () => void;
};

export const SearchUserItem = ({
  user,
  recipesCount,
  onSelect,
}: SearchUserItemProps) => (
  <SearchCommandItem
    id={user._id}
    label={user.name}
    icon={<ChefHat className="size-4" />}
    meta={{
      icon: <UtensilsCrossed className="size-3" strokeWidth={1} />,
      value: recipesCount,
    }}
    onSelect={onSelect}
  />
);
