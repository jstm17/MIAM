import { useQuery } from "@tanstack/react-query";
import { cookingTimeService } from "../../services/cookingTimeService";
import type { CookingTime } from "../../types/cookingTime.types";

export const useGetCookingTimeById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cooking-times", "id", id],
    queryFn: () =>
      cookingTimeService
        .getById(id)
        .then((res) => res.data.data as CookingTime),
    enabled: !!id,
  });

  return { cookingTime: data ?? null, isLoading, error };
};
