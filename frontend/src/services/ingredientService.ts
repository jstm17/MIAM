import axiosInstance from "../lib/axiosInstance";

const INGREDIENT_URL = "/ingredients";

export const ingredientService = {
  getAll: () => axiosInstance.get(INGREDIENT_URL),
  getAllVisibles: () => axiosInstance.get(`${INGREDIENT_URL}/visibles`),
  delete: (id: string) => axiosInstance.delete(`${INGREDIENT_URL}/${id}`),
  deleteMany: (ids: string[]) =>
    axiosInstance.delete(`${INGREDIENT_URL}`, { data: { ids } }),
  resetUrl: (id: string) =>
    axiosInstance.patch(`${INGREDIENT_URL}/${id}/reset-url`),
  resetUrlMany: (ids: string[]) =>
    axiosInstance.patch(`${INGREDIENT_URL}/reset-url`, { ids }),
  updateUrl: (id: string, url: string) =>
    axiosInstance.patch(`${INGREDIENT_URL}/${id}/url`, { url }),
  updateName: (id: string, name: string) =>
    axiosInstance.patch(`${INGREDIENT_URL}/${id}/name`, { name }),
  create: (data: { name: string }) => axiosInstance.post(INGREDIENT_URL, data),
};
