import { userService } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReorderProducts = () => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (orderedNames: string[]) =>
      userService.reorderProducts(orderedNames).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  return { reorderProducts: mutateAsync };
};
