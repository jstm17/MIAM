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

  delete: (id: string) => axiosInstance.delete(`${CATEGORY_URL}/${id}`),
  deleteMany: (ids: string[]) =>
    axiosInstance.delete(`${CATEGORY_URL}`, { data: { ids } }),
  resetUrl: (id: string) =>
    axiosInstance.patch(`${CATEGORY_URL}/${id}/reset-url`),
  resetUrlMany: (ids: string[]) =>
    axiosInstance.patch(`${CATEGORY_URL}/reset-url`, { ids }),
  updateUrl: (id: string, url: string) =>
    axiosInstance.patch(`${CATEGORY_URL}/${id}/url`, { url }),
};
