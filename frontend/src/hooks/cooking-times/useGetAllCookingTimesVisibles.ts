import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { cookingTimeService } from "../../services/cookingTimeService";
import type { CookingTime } from "../../types/cookingTime.types";

export const useGetAllCookingTimesVisibles = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cooking-times", "visibles"],
    queryFn: () =>
      cookingTimeService
        .getAllVisibles()
        .then((res) => res.data.data as CookingTime[]),
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
