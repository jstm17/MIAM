import axiosInstance from "../lib/axiosInstance";

const CATEGORY_URL = "/categories";

export const categoryService = {
  getAll: () => axiosInstance.get(CATEGORY_URL),
  getAllVisibles: () => axiosInstance.get(`${CATEGORY_URL}/visibles`),

  getBySlug: (slug: string) =>
    axiosInstance.get(`${CATEGORY_URL}/slug/${slug}`),

  create: (data: { name: string }) => axiosInstance.post(CATEGORY_URL, data),
};
