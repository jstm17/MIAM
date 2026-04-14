import { userService } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type UpdateProductPayload = {
  name: string;
  newName?: string;
  checked?: boolean;
};

export const useUpdateProductInCart = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: UpdateProductPayload) =>
      userService
        .updateProductInCart(payload.name, {
          newName: payload.newName,
          checked: payload.checked,
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw new Error(err.response?.data?.message || err.message);
    },
  });

  return { updateProductInCart: mutateAsync, isPending, error };
};
