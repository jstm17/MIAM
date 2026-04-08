import { useState } from "react";
import { userService } from "../../services/userService";
import { useAuth } from "../useAuth";

export const useClearShoppingList = () => {
  const [loading, setLoading] = useState(false);
  const { refetchUser } = useAuth();

  const clearShoppingList = async () => {
    setLoading(true);
    try {
      await userService.clearShoppingList();
      await refetchUser();
    } catch (error) {
      console.error("Error clearing shopping list:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { clearShoppingList, loading };
};
