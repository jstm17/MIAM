import { ingredientService } from "@/services/ingredientService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateIngredientUrl = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) =>
      ingredientService.updateUrl(id, url).then((res) => res.data.data),
    onSuccess: (updatedIngredient) => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.setQueryData(
        ["ingredient", updatedIngredient._id],
        updatedIngredient,
      );
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { updateUrl: mutateAsync, isPending, error };
};
