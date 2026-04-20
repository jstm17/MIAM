import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { cookingTimeService } from "../../services/cookingTimeService";

export const useToggleCookingTimeVisibility = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, visible }: { id: string; visible: boolean }) =>
      visible
        ? cookingTimeService.hide(id).then((res) => res.data)
        : cookingTimeService.show(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cooking-times", "visibles"],
      });
      queryClient.invalidateQueries({ queryKey: ["cooking-times"] });
      queryClient.invalidateQueries({ queryKey: ["cooking-time"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  const toggleVisibility = (id: string, visible: boolean) =>
    mutateAsync({ id, visible });

  return { toggleVisibility, isPending };
};
