import { useGetAllCookingTimesVisiblesByUserId } from "@/hooks/cooking-times/useGetAllCookingTimesVisiblesByUserId";
import type { User } from "@/types/user.types";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CookingTimeCard } from "../cooking-time-card/CookingTimeCard";
import { CookingTimesFilters } from "../cooking-time-card/CookingTimesFilters";
import { HomeContentSkeleton } from "../home/skeletons/HomeContentSkeleton";
import { EmptyCard } from "../shared/EmptyCard";

type UserContentCookingTimeProps = {
  user: User;
};

export const UserContentCookingTime = ({
  user,
}: UserContentCookingTimeProps) => {
  const { cookingTimes, totalCookingTimes, isLoading } =
    useGetAllCookingTimesVisiblesByUserId(user._id);
  const [sort, setSort] = useState("recent");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const allCategories = Array.from(
      new Set(cookingTimes.flatMap((r) => r.categories).map((c) => c.name)),
    );
    setSelectedCategories(allCategories);
  }, [cookingTimes]);

  const filteredCookingTimes = useMemo(() => {
    return cookingTimes
      .filter((cookingTime) =>
        cookingTime.categories.some((c) => selectedCategories.includes(c.name)),
      )
      .sort((a, b) =>
        sort === "recent"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [cookingTimes, selectedCategories, sort]);

  if (isLoading) {
    return <HomeContentSkeleton />;
  }

  if (filteredCookingTimes.length === 0) {
    return (
      <div>
        <EmptyCard
          title="0 temps de cuisson disponible"
          description={`${user.name} n'a pas ajouté de temps de cuisson.`}
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
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      {filteredCookingTimes.map((cookingTime) => (
        <Link to={`/cookingTime/${cookingTime.slug}`} key={cookingTime.slug}>
          <CookingTimeCard cookingTime={cookingTime} />
        </Link>
      ))}
    </div>
  );
};
