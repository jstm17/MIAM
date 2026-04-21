import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { cookingTimeService } from "../../services/cookingTimeService";
import type { AdminCookingTime } from "../../types/cookingTime.types";

export const useGetAllCookingTimes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cooking-times"],
    queryFn: () =>
      cookingTimeService
        .getAll()
        .then((res) => res.data.data as AdminCookingTime[]),
    staleTime: 0,
  });

  const cookingTimes = useMemo(() => data ?? [], [data]);

  return {
    cookingTimes,
    totalCookingTimes: data?.length ?? 0,
    isLoading,
    error,
  };
};
