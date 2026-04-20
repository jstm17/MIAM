import type { CookingTime } from "@/types/cookingTime.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { cookingTimeService } from "../../services/cookingTimeService";

export const useGetAllCookingTimesByMe = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cooking-times", "me"],
    queryFn: () =>
      cookingTimeService
        .getAllByMe()
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
