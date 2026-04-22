import { categoryService } from "@/services/categoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useResetCategoryUrl = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: string) =>
      categoryService.resetUrl(id).then((res) => res.data.data),
    onSuccess: (updatedCategory) => {
      // Invalider la query pour refetch les ingrédients
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // Optionnel: mettre à jour le cache directement
      queryClient.setQueryData(
        ["category", updatedCategory._id],
        updatedCategory,
      );
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { resetUrl: mutateAsync, isPending, error };
};
