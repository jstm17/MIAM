import type { ChatTurn, RecipeDraft } from "@/types/chat.types";
import axiosInstance from "../lib/axiosInstance";

export type AskRecipeResponse = {
  error: boolean;
  message: string;
  data: {
    text: string;
    recipe: RecipeDraft | null;
  };
};

export const chatService = {
  ask: (messages: ChatTurn[]) =>
    axiosInstance.post<AskRecipeResponse>("/chat", { messages }),
};
