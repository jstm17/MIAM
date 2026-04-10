import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { userService } from "../../services/userService";
import type { User } from "../../types/user.types";

export const useGetAllUsers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      userService.getAllUsers().then((res) => res.data.data as User[]),
    staleTime: 0,
  });

  const users = useMemo(() => data ?? [], [data]);

  return {
    users,
    totalUsers: data?.length ?? 0,
    isLoading,
    error,
  };
};
