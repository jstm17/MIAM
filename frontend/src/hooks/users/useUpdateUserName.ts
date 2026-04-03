import { userService } from "@/services/userService";
import { useState } from "react";
import { useAuth } from "../useAuth";
import type { AxiosError } from "axios";

export const useUpdateUserName = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refetchUser } = useAuth();
  const updateUserName = async (newName: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await userService.updateUserName(newName);
      await refetchUser();
      return res.data;
    } catch (err: unknown) {
      const apiError = err as AxiosError<{ message: string }>;
      const message = apiError.response?.data?.message || apiError.message;
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { updateUserName, loading, error };
};
