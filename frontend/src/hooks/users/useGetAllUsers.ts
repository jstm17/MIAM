import type { AdminUser } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { userService } from "../../services/userService";

export const useGetAllUsers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      userService.getAllUsers().then((res) => res.data.data as AdminUser[]),
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
