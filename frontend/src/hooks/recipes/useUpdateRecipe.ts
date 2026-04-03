import { useState } from "react";
import { recipeService } from "../../services/recipeService";

export const useUpdateRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRecipe = async (id: string, data: unknown) => {
    setLoading(true);
    setError(null);
    try {
      const res = await recipeService.update(id, data);
      return res.data;
    } catch (err: unknown) {
      const message = (err as { message: string }).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateRecipe, loading, error };
};
