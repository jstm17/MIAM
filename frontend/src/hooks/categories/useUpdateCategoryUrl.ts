import { categoryService } from "@/services/categoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateCategoryUrl = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) =>
      categoryService.updateUrl(id, url).then((res) => res.data.data),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.setQueryData(
        ["category", updatedCategory._id],
        updatedCategory,
      );
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { updateUrl: mutateAsync, isPending, error };
};
