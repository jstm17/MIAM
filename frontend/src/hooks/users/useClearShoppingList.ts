import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";

export const useClearShoppingList = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => userService.clearShoppingList(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) => {
      console.error("Error clearing shopping list:", error);
      throw error;
    },
  });

  return { clearShoppingList: mutateAsync, isPending };
};
