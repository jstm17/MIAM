import { useGetStoredToken } from "@/hooks/useGetStoredToken";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useState, type ReactNode } from "react";
import { LoginUser, RegisterUser, getMe } from "../services/authService";
import type { User } from "../types/user.types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string;
  login: (
    name: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<unknown>;
  logout: () => void;
  register: (name: string, password: string) => Promise<unknown>;
  refetchUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [error, setError] = useState("");
  const { token, updateToken } = useGetStoredToken();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(token!).then((data) => data.data as User),
    enabled: !!token,
  });

  const login = async (name: string, password: string, rememberMe: boolean) => {
    setError("");
    const data = await LoginUser(name, password);
    if (data.error) {
      setError(data.message || "Erreur lors de la connexion");
      throw new Error(data.message);
    }

    const jwtToken = data.data?.token as string | undefined;
    if (!jwtToken) throw new Error("Token manquant");

    updateToken(jwtToken, rememberMe);
    await queryClient.invalidateQueries({ queryKey: ["me"] });
    return data;
  };
  const logout = () => {
    updateToken(null);
    queryClient.removeQueries({ queryKey: ["me"] });
  };

  const register = async (name: string, password: string) => {
    setError("");
    const data = await RegisterUser(name, password);
    if (data.error) {
      setError(data.message || "Erreur lors de l'inscription");
      throw new Error(data.message);
    }
    return data;
  };

  const refetchUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        login,
        logout,
        register,
        refetchUser,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
