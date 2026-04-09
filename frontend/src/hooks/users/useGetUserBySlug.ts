import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import type { User } from "../../types/user.types";

export const useGetUserBySlug = (slug: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "slug", slug],
    queryFn: () =>
      userService.getUserBySlug(slug).then((res) => res.data.data as User),
    enabled: !!slug,
  });

  return { user: data ?? null, isLoading, error };
};
