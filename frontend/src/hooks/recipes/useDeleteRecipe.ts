import { useState } from "react";
import { recipeService } from "../../services/recipeService";

export const useDeleteRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRecipe = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await recipeService.delete(id);
      return res.data;
    } catch (err: unknown) {
      const message = (err as { message: string }).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRecipe, loading, error };
};
