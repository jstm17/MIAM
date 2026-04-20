import { useGetAllCookingTimesVisibles } from "@/hooks/cooking-times/useGetAllCookingTimesVisibles";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CookingTimeCard } from "../cooking-time-card/CookingTimeCard";
import { CookingTimesFilters } from "../cooking-time-card/CookingTimesFilters";
import { EmptyCard } from "../shared/EmptyCard";
import { HomeContentSkeleton } from "./skeletons/HomeContentSkeleton";

export const HomeCookingTimeContent = () => {
  const { cookingTimes, totalCookingTimes, isLoading } =
    useGetAllCookingTimesVisibles();
  const navigate = useNavigate();
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

  if (totalCookingTimes === 0) {
    return (
      <EmptyCard
        title="0 temps de cuisson disponible"
        description="Personne n'a ajouté de temps de cuisson."
        buttonText="Ajouter un temps de cuisson"
        onButtonClick={() => navigate("/add?tab=cooking-time")}
      />
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
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      {filteredCookingTimes.map((cookingTime) => (
        <CookingTimeCard cookingTime={cookingTime} key={cookingTime.slug} />
      ))}
    </div>
  );
};
