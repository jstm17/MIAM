import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { cookingTimeService } from "../../services/cookingTimeService";
import type { CookingTime } from "../../types/cookingTime.types";

export const useGetAllCookingTimesVisiblesByUserId = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cooking-times", "user", "visibles", id],
    queryFn: () =>
      cookingTimeService
        .getAllByUserId(id)
        .then((res) =>
          (res.data.data as CookingTime[]).filter(
            (cookingTime) => cookingTime.visible,
          ),
        ),
    enabled: !!id,
    staleTime: 0,
  });

  const cookingTimes = useMemo(() => data ?? [], [data]);

  return {
    cookingTimes,
    totalCookingTimes: cookingTimes.length,
    isLoading,
    error,
  };
};
