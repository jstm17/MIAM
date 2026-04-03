import { useState } from "react";
import { userService } from "../../services/userService";
import { useAuth } from "../useAuth";

export const useSaveRecipe = () => {
  const [loading, setLoading] = useState(false);
  const { refetchUser } = useAuth();

  const saveRecipe = async (recipeId: string) => {
    setLoading(true);
    try {
      await userService.saveRecipe(recipeId);
      await refetchUser(); // Refetch user to update saved recipes
    } catch (error) {
      console.error("Error saving recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const unsaveRecipe = async (recipeId: string) => {
    setLoading(true);
    try {
      await userService.unsaveRecipe(recipeId);
      await refetchUser(); // Refetch user to update saved recipes
    } catch (error) {
      console.error("Error unsaving recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  return { saveRecipe, unsaveRecipe, loading };
};
