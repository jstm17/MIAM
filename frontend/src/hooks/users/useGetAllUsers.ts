import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import type { User } from "../../types/user.types";

export const useGetAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userService
      .getAllUsers()
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
};
