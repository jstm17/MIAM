// AuthContext.tsx
import { useGetStoredToken } from "@/hooks/useGetStoredToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useRef, useState, type ReactNode } from "react";
import { LoginUser, RegisterUser, getMe } from "../services/authService";
import type { User } from "../types/user.types";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string;
  isAdmin: boolean | undefined;
  login: (
    name: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<unknown>;
  logout: () => void;
  register: (name: string, password: string) => Promise<unknown>;
  refetchUser: () => Promise<void>;
  isLoginPending: boolean;
  isRegisterPending: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [error, setError] = useState("");
  const { token, updateToken } = useGetStoredToken();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(token!).then((data) => data.data as User),
    enabled: !!token,
    staleTime: 0,
  });

  const rememberMeRef = useRef(false);

  const loginMutation = useMutation({
    mutationFn: ({ name, password }: { name: string; password: string }) =>
      LoginUser(name, password),
    onSuccess: async (data) => {
      const jwtToken = data.data?.token;
      if (!jwtToken) throw new Error("Token manquant");
      updateToken(jwtToken, rememberMeRef.current);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: Error) => {
      setError(err.message || "Erreur lors de la connexion");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ name, password }: { name: string; password: string }) =>
      RegisterUser(name, password),
    onError: (err: Error) => {
      setError(err.message || "Erreur lors de l'inscription");
    },
  });

  const login = async (name: string, password: string, rememberMe: boolean) => {
    setError("");
    rememberMeRef.current = rememberMe;
    return loginMutation.mutateAsync({ name, password });
  };

  const logout = () => {
    updateToken(null);
    queryClient.removeQueries({ queryKey: ["me"] });
  };

  const register = async (name: string, password: string) => {
    setError("");
    return registerMutation.mutateAsync({ name, password });
  };

  const refetchUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  const isAdmin = user && user.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAdmin,
        login,
        logout,
        register,
        refetchUser,
        error,
        isLoginPending: loginMutation.isPending,
        isRegisterPending: registerMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
