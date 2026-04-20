import type { RecipeFormData } from "@/schemas/recipeForm.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { recipeService } from "../../services/recipeService";

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RecipeFormData }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("timePrep", data.timePrep?.toString() ?? "");
      formData.append("timeCook", data.timeCook?.toString() ?? "");
      formData.append("personsNumber", data.personsNumber?.toString() ?? "");
      formData.append("categories", JSON.stringify(data.categories));
      formData.append("ingredients", JSON.stringify(data.ingredients));
      formData.append("instructions", JSON.stringify(data.instructions));
      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else if (data.image) {
        formData.append("image", data.image);
      }
      formData.append("visible", data.visible.toString());
      const res = await recipeService.update(id, formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({
        queryKey: ["recipes", "category", "visibles"],
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", "visible"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message = err.response?.data?.message || err.message;
      throw new Error(message);
    },
  });

  const updateRecipe = (id: string, data: RecipeFormData) =>
    mutateAsync({ id, data });

  return { updateRecipe, isPending, error };
};
