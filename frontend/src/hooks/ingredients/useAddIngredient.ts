import { ingredientService } from "@/services/ingredientService";
import type { AxiosError } from "axios";
import { useState } from "react";

export const useAddIngredient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ingredientService.create({ name });
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

  return { addIngredient, loading, error };
};
