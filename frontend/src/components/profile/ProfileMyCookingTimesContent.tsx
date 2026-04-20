import type { CookingTime } from "@/types/cookingTime.types";
import { useNavigate } from "react-router-dom";
import { CookingTimeCard } from "../cooking-time-card/CookingTimeCard";
import { CookingTimesFilters } from "../cooking-time-card/CookingTimesFilters";
import { EmptyCard } from "../shared/EmptyCard";

import { useMemo, useState } from "react";

type ProfileMyCookingTimeContentProps = {
  cookingTimes: CookingTime[];
  totalElement: number;
};

export const ProfileMyCookingTimesContent = ({
  cookingTimes,
  totalElement,
}: ProfileMyCookingTimeContentProps) => {
  const navigate = useNavigate();
  const [sort, setSort] = useState("recent");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    Array.from(
      new Set(cookingTimes.flatMap((r) => r.categories).map((c) => c.name)),
    ),
  );
  const [selectedVisibility, setSelectedVisibility] = useState<string[]>([
    "visible",
    "hidden",
  ]);

  const filteredCookingTimes = useMemo(() => {
    return cookingTimes
      .filter((cookingTime) =>
        cookingTime.categories.some((c) => selectedCategories.includes(c.name)),
      )
      .filter((cookingTime) =>
        selectedVisibility.includes(cookingTime.visible ? "visible" : "hidden"),
      )
      .sort((a, b) =>
        sort === "recent"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [cookingTimes, selectedCategories, selectedVisibility, sort]);

  if (totalElement === 0) {
    return (
      <EmptyCard
        title="0 temps de cuisson disponible"
        description="Vous n'avez ajouté aucun temps de cuisson."
        buttonText="Ajouter un temps de cuisson"
        onButtonClick={() => navigate("/add?tab=cooking-time")}
      />
    );
  }

  return (
    <>
      <CookingTimesFilters
        title={
          totalElement > 1
            ? "temps de cuisson ajoutés"
            : "temps de cuisson ajouté"
        }
        originalCookingTimes={cookingTimes}
        totalElement={filteredCookingTimes.length}
        sort={sort}
        setSort={setSort}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedVisibility={selectedVisibility}
        setSelectedVisibility={setSelectedVisibility}
      />
      {filteredCookingTimes.map((cookingTime) => (
        <CookingTimeCard cookingTime={cookingTime} key={cookingTime.slug} />
      ))}
    </>
  );
};
