import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { cookingTimeService } from "../../services/cookingTimeService";
import type { CookingTime } from "../../types/cookingTime.types";

export const useGetAllVisiblesByCategory = (slug: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cooking-times", "category", "visibles", slug],
    queryFn: () =>
      cookingTimeService
        .getAllVisiblesByCategory(slug)
        .then((res) => res.data.data as CookingTime[]),
    enabled: !!slug,
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
