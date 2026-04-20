import type { CookingTimeFormData } from "@/schemas/cookingTimeForm.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { cookingTimeService } from "../../services/cookingTimeService";

export const useUpdateCookingTime = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CookingTimeFormData;
    }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("device", data.device?.toString() ?? "");
      formData.append("degreeCook", data.degreeCook?.toString() ?? "");
      formData.append("timeCook", data.timeCook?.toString() ?? "");
      formData.append("methodCook", data.methodCook?.toString() ?? "");
      formData.append("notes", data.notes?.toString() ?? "");
      formData.append("categories", JSON.stringify(data.categories));
      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else if (data.image) {
        formData.append("image", data.image);
      }
      formData.append("visible", data.visible.toString());
      const res = await cookingTimeService.update(id, formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooking-times"] });
      queryClient.invalidateQueries({ queryKey: ["cooking-time"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({
        queryKey: ["cooking-times", "category", "visibles"],
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["cooking-time", "visible"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message = err.response?.data?.message || err.message;
      throw new Error(message);
    },
  });

  const updateCookingTime = (id: string, data: CookingTimeFormData) =>
    mutateAsync({ id, data });

  return { updateCookingTime, isPending, error };
};
