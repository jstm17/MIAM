import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";

export const useUnsaveCookingTime = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (cookingTimeId: string) =>
      userService.unsaveCookingTime(cookingTimeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["cooking-times"] });
      queryClient.invalidateQueries({ queryKey: ["cooking-time"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error unsaving cooking time:", error);
    },
  });

  return {
    unsaveCookingTime: mutateAsync,
    isPending,
  };
};
