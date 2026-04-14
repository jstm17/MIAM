import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { userService } from "../../services/userService";
import type { User } from "../../types/user.types";

export const useGetAllUsersVisibles = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      userService.getAllUsersVisibles().then((res) => res.data.data as User[]),
    staleTime: 0,
  });

  const users = useMemo(
    () => (data ?? []).filter((user) => (user.recipesCount ?? 0) > 0),
    [data],
  );

  return {
    users,
    totalUsers: users.length,
    isLoading,
    error,
  };
};
