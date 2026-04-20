import axiosInstance from "../lib/axiosInstance";

const CATEGORY_URL = "/categories";

export const categoryService = {
  getAll: () => axiosInstance.get(CATEGORY_URL),

  getAllVisibles: () => axiosInstance.get(`${CATEGORY_URL}/visibles`),

  getAllVisiblesCookingTime: () =>
    axiosInstance.get(`${CATEGORY_URL}/cooking-times-visibles`),

  getAllVisiblesCookingTimes: () =>
    axiosInstance.get(`${CATEGORY_URL}/cooking-times-visibles`),

  getTopVisibles: () => axiosInstance.get(`${CATEGORY_URL}/top`),

  getTopVisiblesCookingTimes: () =>
    axiosInstance.get(`${CATEGORY_URL}/cooking-times-top`),

  getBySlug: (slug: string) =>
    axiosInstance.get(`${CATEGORY_URL}/slug/${slug}`),

  create: (data: { name: string }) => axiosInstance.post(CATEGORY_URL, data),
};
