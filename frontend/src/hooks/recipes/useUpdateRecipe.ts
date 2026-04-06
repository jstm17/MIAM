import type { UpdateRecipeFormData } from "@/schemas/updateRecipeForm.schemas";
import type { AxiosError } from "axios";
import { useState } from "react";
import { recipeService } from "../../services/recipeService";

export const useUpdateRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRecipe = async (id: string, data: UpdateRecipeFormData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("time", data.time.toString());
      formData.append("personsNumber", data.personsNumber.toString());
      formData.append("categories", JSON.stringify(data.categories));
      formData.append("ingredients", JSON.stringify(data.ingredients));
      formData.append("instructions", JSON.stringify(data.instructions));
      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else if (data.image) {
        formData.append("image", data.image);
      }
      const res = await recipeService.update(id, formData);
      return res.data;
    } catch (err: unknown) {
      const apiError = err as AxiosError<{ message: string }>;
      const message = apiError.response?.data?.message || apiError.message;
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { updateRecipe, loading, error };
};
