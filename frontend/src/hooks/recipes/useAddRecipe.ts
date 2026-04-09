import type { AddRecipeFormData } from "@/schemas/addRecipeForm.schemas";
import { recipeService } from "@/services/recipeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useAddRecipe = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data: AddRecipeFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("time", data.time.toString());
      formData.append("personsNumber", data.personsNumber.toString());
      formData.append("categories", JSON.stringify(data.categories));
      formData.append("ingredients", JSON.stringify(data.ingredients));
      formData.append("instructions", JSON.stringify(data.instructions));
      if (data.image) {
        formData.append("image", data.image);
      }
      const res = await recipeService.create(formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message = err.response?.data?.message || err.message;
      throw new Error(message);
    },
  });

  const addRecipe = (data: AddRecipeFormData) => mutateAsync(data);

  return { addRecipe, isPending, error };
};
