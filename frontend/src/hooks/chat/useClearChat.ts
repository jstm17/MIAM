import { clearChatHistory } from "@/utils/chatHistory";
import { useMutation } from "@tanstack/react-query";

export const useClearChat = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      clearChatHistory();
    },
  });

  return { clearChat: mutateAsync, isPending };
};