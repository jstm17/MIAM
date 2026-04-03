import { useState } from "react";
import { userService } from "../../services/userService";

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.deleteUser();
      return res.data;
    } catch (err: unknown) {
      const message = (err as { message: string }).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
};
