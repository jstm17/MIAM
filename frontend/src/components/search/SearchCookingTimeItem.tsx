import type { CookingTime } from "@/types/cookingTime.types";
import { Timer, UserRound } from "lucide-react";
import { SearchCommandItem } from "./SearchCommandItem";

type SearchCookingTimeItemProps = {
  cookingTime: CookingTime;
  onSelect: () => void;
};

export const SearchCookingTimeItem = ({
  cookingTime,
  onSelect,
}: SearchCookingTimeItemProps) => (
  <SearchCommandItem
    id={cookingTime._id}
    label={cookingTime.name}
    icon={<Timer className="size-4" />}
    metaCookingTime={{
      icon: <UserRound className="size-3" strokeWidth={1} />,
      value: cookingTime.addedBy?.name ?? "",
    }}
    onSelect={onSelect}
  />
);
