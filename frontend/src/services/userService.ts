import axiosInstance from "../lib/axiosInstance";

const USER_URL = "/users";

export const userService = {
  getTopAllUsers: () => axiosInstance.get(`${USER_URL}/top`),

  getAllUsers: () => axiosInstance.get(`${USER_URL}/all`),

  getAllUsersVisibles: () => axiosInstance.get(`${USER_URL}/visible`),

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

  updateUserProfile: (formData: FormData) =>
    axiosInstance.put(`${USER_URL}/update`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updatePassword: (payload: { currentPassword: string; newPassword: string }) =>
    axiosInstance.put(`${USER_URL}/update-password`, payload),

  deleteUser: (id: string) => axiosInstance.delete(`${USER_URL}/${id}`),

  deleteAccount: () => axiosInstance.delete(USER_URL),

  addProductToCart: (name: string) =>
    axiosInstance.post(`${USER_URL}/product`, { name }),

  updateProductInCart: (
    name: string,
    data: { newName?: string; checked?: boolean },
  ) => axiosInstance.put(`${USER_URL}/product`, { name, ...data }),

  removeProductFromCart: (name: string) =>
    axiosInstance.delete(`${USER_URL}/product`, { data: { name } }),
};
