import { useGetAllVisiblesByCategory } from "@/hooks/cooking-times/useGetAllCookingTimesVibsiblesByCategory";
import type { Category } from "@/types/category.types";
import { useEffect, useMemo, useState } from "react";
import { CookingTimeCard } from "../cooking-time-card/CookingTimeCard";
import { CookingTimesFilters } from "../cooking-time-card/CookingTimesFilters";
import { HomeContentSkeleton } from "../home/skeletons/HomeContentSkeleton";
import { EmptyCard } from "../shared/EmptyCard";

type CategoryCookingTimeContentProps = {
  category: Category;
};

export const CategoryCookingTimeContent = ({
  category,
}: CategoryCookingTimeContentProps) => {
  const { cookingTimes, totalCookingTimes, isLoading } =
    useGetAllVisiblesByCategory(category.slug);
  const [sort, setSort] = useState("recent");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const allCategories = Array.from(
      new Set(cookingTimes.flatMap((r) => r.categories).map((c) => c.name)),
    );
    setSelectedCategories(allCategories);

    const allUsers = Array.from(
      new Set(
        cookingTimes
          .map((cookingTime) => cookingTime.addedBy?._id)
          .filter(Boolean),
      ),
    );
    setSelectedUsers(allUsers as string[]);
  }, [cookingTimes]);

  const filteredCookingTimes = useMemo(() => {
    return cookingTimes
      .filter(
        (cookingTime) =>
          cookingTime.categories.some((c) =>
            selectedCategories.includes(c.name),
          ) && selectedUsers.includes(cookingTime.addedBy?._id ?? ""),
      )
      .sort((a, b) =>
        sort === "recent"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [cookingTimes, selectedCategories, selectedUsers, sort]);

  if (isLoading) {
    return <HomeContentSkeleton />;
  }

  if (filteredCookingTimes.length === 0) {
    return (
      <div>
        <EmptyCard
          title="0 temps de cuisson disponible"
          description={`Personne n'a pas ajouté de temps de cuisson dans cette catégorie.`}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <CookingTimesFilters
        title={
          totalCookingTimes > 1
            ? "temps de cuisson disponibles"
            : "temps de cuisson disponible"
        }
        originalCookingTimes={cookingTimes}
        totalElement={filteredCookingTimes.length}
        sort={sort}
        setSort={setSort}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      {filteredCookingTimes.map((cookingTime) => (
        <CookingTimeCard cookingTime={cookingTime} key={cookingTime.slug} />
      ))}
    </div>
  );
};
