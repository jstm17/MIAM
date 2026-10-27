import { chatService } from "@/services/chatService";
import type { ChatTurn } from "@/types/chat.types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useAskRecipe = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (messages: ChatTurn[]) => {
      try {
        const res = await chatService.ask(messages);
        return res.data.data;
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        throw new Error(
          axiosError.response?.data?.message ||
            "Zest n'a pas pu répondre. Réessayez dans un instant.",
        );
      }
    },
  });

  return { askRecipe: mutateAsync, isPending };
};
