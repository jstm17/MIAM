import type { CookingTimeFormData } from "@/schemas/cookingTimeForm.schemas";
import { cookingTimeService } from "@/services/cookingTimeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useAddCookingTime = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data: CookingTimeFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("device", data.device?.toString() ?? "");
      formData.append("degreeCook", data.degreeCook?.toString() ?? "");
      formData.append("timeCook", data.timeCook?.toString() ?? "");
      formData.append("methodCook", data.methodCook?.toString() ?? "");
      formData.append("notes", data.notes?.toString() ?? "");
      formData.append("categories", JSON.stringify(data.categories));
      if (data.image) {
        formData.append("image", data.image);
      }
      formData.append("visible", data.visible.toString());
      const res = await cookingTimeService.create(formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cookingTimes"] });
      queryClient.invalidateQueries({ queryKey: ["cookingTime"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message = err.response?.data?.message || err.message;
      throw new Error(message);
    },
  });

  const addCookingTime = (data: CookingTimeFormData) => mutateAsync(data);

  return { addCookingTime, isPending, error };
};
