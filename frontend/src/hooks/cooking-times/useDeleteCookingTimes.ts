import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { cookingTimeService } from "../../services/cookingTimeService";

export const useDeleteCookingTimes = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (ids: string[]) =>
      cookingTimeService.deleteMany(ids).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooking-times"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { deleteCookingTimes: mutateAsync, isPending };
};
