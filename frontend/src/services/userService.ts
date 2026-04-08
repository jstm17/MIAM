import axiosInstance from "../lib/axiosInstance";

const USER_URL = "/users";

export const userService = {
  getAllUsers: () => axiosInstance.get(`${USER_URL}/all`),

  getUserBySlug: (slug: string) => axiosInstance.get(`${USER_URL}/${slug}`),

  saveRecipe: (recipeId: string) =>
    axiosInstance.post(`${USER_URL}/saved-recipes/${recipeId}`),

  unsaveRecipe: (recipeId: string) =>
    axiosInstance.delete(`${USER_URL}/saved-recipes/${recipeId}`),

  addIngredientToCart: (recipeId: string, ingredientId: string) =>
    axiosInstance.post(`${USER_URL}/saved-ingredients/${recipeId}`, {
      ingredientId,
    }),

  removeIngredientFromCart: (recipeId: string, ingredientId: string) =>
    axiosInstance.delete(
      `${USER_URL}/saved-ingredients/${recipeId}/${ingredientId}`,
    ),

  clearShoppingList: () =>
    axiosInstance.delete(`${USER_URL}/saved-ingredients`),

  updateUserName: (newName: string) =>
    axiosInstance.put(`${USER_URL}/update-name`, {
      name: newName,
    }),

  deleteUser: () => axiosInstance.delete(USER_URL),
};
