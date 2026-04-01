import { createContext, useState, useEffect, type ReactNode } from "react";
import { LoginUser, RegisterUser, getMe } from "../services/authService";
import type { User } from "../types/user.types";

// 👇 Typage du contexte
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string;
  login: (name: string, password: string) => Promise<any>;
  logout: () => void;
  register: (name: string, password: string) => Promise<any>;
  getToken: () => Promise<string>;
}

// 👇 Typage des props du Provider
interface AuthProviderProps {
  children: ReactNode;
}

// 👇 Création du contexte avec typage
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Set user au démarrage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    getMe(token)
      .then((data) => setUser(data.data))
      .catch((err: any) => {
        setError(
          err.message || "Erreur lors de la récupération de l'utilisateur",
        );
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  // Login
  const login = async (name: string, password: string) => {
    const data = await LoginUser(name, password);
    if (data.error) {
      setError(data.message || "Erreur lors de la connexion");
      throw new Error(data.message);
    }

    const token = data.data.token;
    const me = await getMe(token);

    localStorage.setItem("token", token);
    setUser(me.data);

    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Register
  const register = async (name: string, password: string) => {
    const data = await RegisterUser(name, password);
    if (data.error) {
      setError(data.message || "Erreur lors de l'inscription");
      throw new Error(data.message);
    }
    return data;
  };

  // Get token
  const getToken = async (): Promise<string> => {
    const token = localStorage.getItem("token");
    if (!token) {
      const err = new Error("Token non trouvé");
      setError(err.message);
      throw err;
    }
    return token;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, getToken, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
