import axiosInstance from "../lib/axiosInstance";

const RECIPE_URL = "/recipes";

export const recipeService = {
  getAll: () => axiosInstance.get(`${RECIPE_URL}/all`),

  getAllByMe: () => axiosInstance.get(`${RECIPE_URL}`),

  getAllByUserId: (id: string) => axiosInstance.get(`${RECIPE_URL}/user/${id}`),

  getById: (id: string) => axiosInstance.get(`${RECIPE_URL}/${id}`),

  getBySlug: (slug: string) => axiosInstance.get(`${RECIPE_URL}/slug/${slug}`),

  getAllByCategory: (slug: string) =>
    axiosInstance.get(`${RECIPE_URL}/category/${slug}`),

  create: (data: unknown) => axiosInstance.post(`${RECIPE_URL}/`, data),

  update: (id: string, data: unknown) =>
    axiosInstance.put(`${RECIPE_URL}/${id}`, data),

  delete: (id: string) => axiosInstance.delete(`${RECIPE_URL}/${id}`),
};
