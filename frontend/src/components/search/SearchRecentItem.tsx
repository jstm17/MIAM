import type { RecentSearch } from "@/types/search.types";
import { Clock, Timer, UserRound, UtensilsCrossed } from "lucide-react";
import { SearchCommandItem } from "./SearchCommandItem";

type SearchRecentItemProps = {
  search: RecentSearch;
  onSelect: () => void;
};

export const SearchRecentItem = ({
  search,
  onSelect,
}: SearchRecentItemProps) => (
  <SearchCommandItem
    id={search.slug}
    label={search.label}
    icon={<Clock className="size-4" />}
    metaRecipe={
      search.type === "recipe" && search.addedBy
        ? {
            icon: <UserRound className="size-3" strokeWidth={1} />,
            value: search.addedBy,
          }
        : search.recipesCount !== undefined
          ? {
              icon: <UtensilsCrossed className="size-3" strokeWidth={1} />,
              value: search.recipesCount,
            }
          : undefined
    }
    metaCookingTime={
      search.type === "cooking-time" && search.addedBy
        ? {
            icon: <UserRound className="size-3" strokeWidth={1} />,
            value: search.addedBy,
          }
        : search.cookingTimesCount !== undefined
          ? {
              icon: <Timer className="size-3" strokeWidth={1} />,
              value: search.cookingTimesCount,
            }
          : undefined
    }
    onSelect={onSelect}
  />
);
