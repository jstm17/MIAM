import { useState } from "react";
import { userService } from "../../services/userService";
import { useAuth } from "../useAuth";

export const useRemoveIngredientFromCart = () => {
  const [loading, setLoading] = useState(false);
  const { refetchUser } = useAuth();

  const removeIngredientFromCart = async (
    recipeId: string,
    ingredientId: string,
  ) => {
    setLoading(true);
    try {
      await userService.removeIngredientFromCart(recipeId, ingredientId);
      await refetchUser();
    } catch (error) {
      console.error("Error removing ingredient from cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { removeIngredientFromCart, loading };
};
