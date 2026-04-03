import axiosInstance from "../lib/axiosInstance";
import type { User } from "../types/user.types";

const USER_URL = "/users";

// 👇 Typage des réponses
interface AuthResponse {
  data: {
    token?: string;
    // autres infos si besoin
  };
  error?: boolean;
  message?: string;
}

// Login
export const LoginUser = async (
  name: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const res = await axiosInstance.post<AuthResponse>(`${USER_URL}/login`, {
      name,
      password,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur de connexion");
  }
};

// Register
export const RegisterUser = async (
  name: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const res = await axiosInstance.post<AuthResponse>(`${USER_URL}/register`, {
      name,
      password,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Erreur lors de l'inscription",
    );
  }
};

// Get current user
export const getMe = async (token: string): Promise<{ data: User }> => {
  try {
    const res = await axiosInstance.get<{ data: User }>(`${USER_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message ||
        "Erreur lors de la récupération de l'utilisateur",
    );
  }
};
