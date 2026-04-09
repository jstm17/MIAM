import { useState } from "react";

export const useGetStoredToken = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || sessionStorage.getItem("token"),
  );

  const updateToken = (newToken: string | null, rememberMe?: boolean) => {
    if (newToken) {
      if (rememberMe) {
        localStorage.setItem("token", newToken);
      } else {
        sessionStorage.setItem("token", newToken);
      }
    } else {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
    setToken(newToken);
  };

  return { token, updateToken };
};
