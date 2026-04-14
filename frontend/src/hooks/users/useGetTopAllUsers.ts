import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { userService } from "../../services/userService";
import type { User } from "../../types/user.types";

export const useGetTopAllUsers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", "top"],
    queryFn: () =>
      userService.getTopAllUsers().then((res) => res.data.data as User[]),
    staleTime: 0,
  });

  const users = useMemo(() => {
    const sorted = [...(data ?? [])].sort(
      (a, b) => (b.recipesCount ?? 0) - (a.recipesCount ?? 0),
    );
    return sorted.slice(0, 10);
  }, [data]);

  return {
    users,
    totalUsers: users.length,
    isLoading,
    error,
  };
};
