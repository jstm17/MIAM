import { adminService } from "@/services/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateAdmins = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (admins: string[]) => adminService.updateAdmins(admins),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
