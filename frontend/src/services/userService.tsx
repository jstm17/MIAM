import axiosInstance from "../lib/axiosInstance";

const USER_URL = "/users";

export const userService = {
  saveRecipe: (recipeId: string) =>
    axiosInstance.post(`${USER_URL}/saved-recipes/${recipeId}`),

  unsaveRecipe: (recipeId: string) =>
    axiosInstance.delete(`${USER_URL}/saved-recipes/${recipeId}`),

  updateUserName: (newName: string) =>
    axiosInstance.put(`${USER_URL}/update-name`, {
      name: newName,
    }),

  deleteUser: () => axiosInstance.delete(USER_URL),
};
