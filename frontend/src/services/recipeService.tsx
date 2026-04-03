import axiosInstance from "../lib/axiosInstance";

const RECIPE_URL = "/recipes";

export const recipeService = {
  getAll: () => axiosInstance.get(`${RECIPE_URL}/all`),

  getAllByUser: () => axiosInstance.get(`${RECIPE_URL}`),

  getById: (id: string) => axiosInstance.get(`${RECIPE_URL}/${id}`),

  create: (data: unknown) => axiosInstance.post(`${RECIPE_URL}/`, data),

  update: (id: string, data: unknown) =>
    axiosInstance.put(`${RECIPE_URL}/${id}`, data),

  delete: (id: string) => axiosInstance.delete(`${RECIPE_URL}/${id}`),
};
