import axiosInstance from "../lib/axiosInstance";

const CATEGORY_URL = "/categories";

export const categoryService = {
  getAll: () => axiosInstance.get(CATEGORY_URL),

  create: (data: { name: string }) => axiosInstance.post(CATEGORY_URL, data),
};
