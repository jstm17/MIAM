import type { Category } from "@/types/category.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { categoryService } from "../../services/categoryService";

export const useResetCategoriesUrl = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (ids: string[]) =>
      categoryService.resetUrlMany(ids).then((res) => res.data.data),
    onSuccess: (updatedCategories) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // Optionnel: mettre à jour le cache directement
      updatedCategories?.forEach((category: Category) => {
        queryClient.setQueryData(["category", category._id], category);
      });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { resetUrlMany: mutateAsync, isPending };
};
