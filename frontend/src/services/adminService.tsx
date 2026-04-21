import axiosInstance from "../lib/axiosInstance";

const ADMIN_URL = "/admins";

export const adminService = {
  getAllAdmins: () => axiosInstance.get(`${ADMIN_URL}/all`),
  updateAdmins: (admins: string[]) =>
    axiosInstance.put(`${ADMIN_URL}/update`, { admins }),
};
