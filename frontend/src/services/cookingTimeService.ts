import axiosInstance from "../lib/axiosInstance";

const COOKING_TIME_URL = "/cooking-times";

export const cookingTimeService = {
  getAll: () => axiosInstance.get(`${COOKING_TIME_URL}/all`),
  getAllByMe: () => axiosInstance.get(`${COOKING_TIME_URL}`),
  getAllVisibles: () => axiosInstance.get(`${COOKING_TIME_URL}/visibles`),
  getAllByUserId: (id: string) =>
    axiosInstance.get(`${COOKING_TIME_URL}/user/${id}`),
  getById: (id: string) => axiosInstance.get(`${COOKING_TIME_URL}/${id}`),
  getBySlug: (slug: string) =>
    axiosInstance.get(`${COOKING_TIME_URL}/slug/${slug}`),
  getAllByCategory: (slug: string) =>
    axiosInstance.get(`${COOKING_TIME_URL}/category/${slug}`),
  getAllVisiblesByCategory: (slug: string) =>
    axiosInstance.get(`${COOKING_TIME_URL}/category/${slug}`),
  create: (data: unknown) => axiosInstance.post(`${COOKING_TIME_URL}/`, data),
  update: (slug: string, data: unknown) =>
    axiosInstance.put(`${COOKING_TIME_URL}/${slug}`, data),
  delete: (id: string) => axiosInstance.delete(`${COOKING_TIME_URL}/${id}`),
  deleteMany: (ids: string[]) =>
    axiosInstance.delete(`${COOKING_TIME_URL}`, { data: { ids } }),
  show: (id: string) => axiosInstance.patch(`${COOKING_TIME_URL}/${id}/show`),
  hide: (id: string) => axiosInstance.patch(`${COOKING_TIME_URL}/${id}/hide`),
};
