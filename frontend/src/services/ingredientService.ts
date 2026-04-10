import axiosInstance from "../lib/axiosInstance";

const INGREDIENT_URL = "/ingredients";

export const ingredientService = {
  getAll: () => axiosInstance.get(INGREDIENT_URL),
  getAllVisibles: () => axiosInstance.get(`${INGREDIENT_URL}/visibles`),

  create: (data: { name: string }) => axiosInstance.post(INGREDIENT_URL, data),
};
