import type { CookingTime } from "@/types/cookingTime.types";
import type { SavedCookingTime } from "@/types/user.types";
import { useMemo } from "react";
import { useAuth } from "../useAuth";

type CookingTimeWithSavedAt = CookingTime & { savedAt: string };

export const useGetSavedCookingTimes = () => {
  const { user, isLoading } = useAuth();

  const cookingTimes = useMemo<CookingTimeWithSavedAt[]>(() => {
    if (!user?.savedCookingTimes) return [];

    return user.savedCookingTimes
      .map((item: SavedCookingTime) => {
        if (!item.cookingTime) return null;
        return {
          ...item.cookingTime,
          savedAt: item.savedAt,
        } as CookingTimeWithSavedAt;
      })
      .filter((cookingTime): cookingTime is CookingTimeWithSavedAt => {
        if (!cookingTime) return false;

        const isOwner = cookingTime.addedBy?._id === user._id;
        return isOwner || cookingTime.visible;
      });
  }, [user]);

  return { cookingTimes, totalCookingTimes: cookingTimes.length, isLoading };
};
