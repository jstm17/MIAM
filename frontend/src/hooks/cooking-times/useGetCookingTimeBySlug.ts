import { useQuery } from "@tanstack/react-query";
import { cookingTimeService } from "../../services/cookingTimeService";
import type { CookingTime } from "../../types/cookingTime.types";

export const useGetCookingTimeBySlug = (slug: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cooking-times", "slug", slug],
    queryFn: () =>
      cookingTimeService
        .getBySlug(slug)
        .then((res) => res.data.data as CookingTime),
    enabled: !!slug,
    staleTime: 0,
  });

  return { cookingTime: data ?? null, isLoading, error };
};
