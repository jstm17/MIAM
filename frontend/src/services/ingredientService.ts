import axiosInstance from "../lib/axiosInstance";

const INGREDIENT_URL = "/ingredients";

export const ingredientService = {
  getAll: () => axiosInstance.get(INGREDIENT_URL),

  create: (data: { name: string }) => axiosInstance.post(INGREDIENT_URL, data),
};
