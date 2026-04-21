import { adminService } from "@/services/adminService";
import type { AdminUser } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetAllAdmins = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admins"],
    queryFn: () =>
      adminService.getAllAdmins().then((res) => res.data.data as AdminUser[]),
    staleTime: 0,
  });

  const admins = useMemo(() => data ?? [], [data]);

  return {
    admins,
    totalAdmins: data?.length ?? 0,
    isLoading,
    error,
  };
};
