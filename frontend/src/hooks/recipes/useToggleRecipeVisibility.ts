import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { recipeService } from "../../services/recipeService";

export const useToggleRecipeVisibility = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, visible }: { id: string; visible: boolean }) =>
      visible
        ? recipeService.hide(id).then((res) => res.data)
        : recipeService.show(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes", "visibles"] });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  const toggleVisibility = (id: string, visible: boolean) =>
    mutateAsync({ id, visible });

  return { toggleVisibility, isPending };
};
