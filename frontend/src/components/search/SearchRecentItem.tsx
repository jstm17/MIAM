import type { RecentSearch } from "@/types/search.types";
import { Clock, UserRound, UtensilsCrossed } from "lucide-react";
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
    meta={
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
    onSelect={onSelect}
  />
);
