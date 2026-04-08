import { useState } from "react";
import { userService } from "../../services/userService";
import { useAuth } from "../useAuth";

export const useAddIngredientToCart = () => {
  const [loading, setLoading] = useState(false);
  const { refetchUser } = useAuth();

  const addIngredientToCart = async (
    recipeId: string,
    ingredientId: string,
  ) => {
    setLoading(true);
    try {
      await userService.addIngredientToCart(recipeId, ingredientId);
      await refetchUser();
    } catch (error) {
      console.error("Error adding ingredient to cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { addIngredientToCart, loading };
};
