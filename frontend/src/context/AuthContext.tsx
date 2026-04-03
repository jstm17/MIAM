import { createContext, useState, useEffect, type ReactNode } from "react";
import { LoginUser, RegisterUser, getMe } from "../services/authService";
import type { User } from "../types/user.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string;
  login: (name: string, password: string) => Promise<unknown>;
  logout: () => void;
  register: (name: string, password: string) => Promise<unknown>;
  getToken: () => Promise<string>;
  refetchUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Sépare le contexte dans ce fichier uniquement, pas de double export component+context
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false); // 👈 dans un bloc séparé, pas inline
      return;
    }

    getMe(token)
      .then((data) => setUser(data.data))
      .catch((err: { message?: string }) => {
        setError(
          err.message || "Erreur lors de la récupération de l'utilisateur",
        );
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (name: string, password: string) => {
    setError("");
    const data = await LoginUser(name, password);
    if (data.error) {
      setError(data.message || "Erreur lors de la connexion");
      throw new Error(data.message);
    }

    const token = data.data?.token as string | undefined;
    if (!token) throw new Error("Token manquant");

    const me = await getMe(token); // 👈 plus d'erreur string | undefined

    localStorage.setItem("token", token);
    setUser(me.data);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError("");
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

  const getToken = async (): Promise<string> => {
    const token = localStorage.getItem("token");
    if (!token) {
      const err = new Error("Token non trouvé");
      setError(err.message);
      throw err;
    }
    return token;
  };

  const refetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const me = await getMe(token);
      setUser(me.data);
    } catch (err: unknown) {
      setError(
        (err as { message?: string }).message ||
          "Erreur lors de la récupération de l'utilisateur",
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        getToken,
        refetchUser,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
