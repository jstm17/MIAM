import { ingredientService } from "@/services/ingredientService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateIngredientName = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      ingredientService.updateName(id, name).then((res) => res.data.data),
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

  return { updateName: mutateAsync, isPending, error };
};
