import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import type { User } from "../../types/user.types";

export const useGetUserBySlug = (slug: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userService
      .getUserBySlug(slug)
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { user, loading, error };
};
