import type { ChatMessage } from "@/types/chat.types";
import { isRecipeDraft } from "@/utils/recipeDraft";

const STORAGE_KEY = "chatHistory";

type ChatSnapshot = {
  messages: ChatMessage[];
  pending: boolean;
};

const listeners = new Set<() => void>();
let generation = 0;

const sessionStorageForToken = () =>
  localStorage.getItem("token") ? localStorage : sessionStorage;

const isChatMessage = (value: unknown): value is ChatMessage => {
  if (!value || typeof value !== "object") return false;
  const message = value as ChatMessage;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string"
  );
};

const readStoredMessages = (): ChatMessage[] => {
  try {
    const raw = sessionStorageForToken().getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isChatMessage).map((message) => ({
      role: message.role,
      content: message.content,
      recipe: isRecipeDraft(message.recipe) ? message.recipe : null,
    }));
  } catch {
    return [];
  }
};

let snapshot: ChatSnapshot = {
  messages: readStoredMessages(),
  pending: false,
};

const emit = () => {
  listeners.forEach((listener) => listener());
};

const persist = () => {
  const current = sessionStorageForToken();
  const other = current === localStorage ? sessionStorage : localStorage;
  other.removeItem(STORAGE_KEY);
  try {
    current.setItem(STORAGE_KEY, JSON.stringify(snapshot.messages));
  } catch {
    // Le quota du navigateur est plein : la conversation reste en mémoire.
  }
};

export const getChatSnapshot = () => snapshot;

export const getChatGeneration = () => generation;

export const subscribeChat = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setChatPending = (pending: boolean) => {
  snapshot = { ...snapshot, pending };
  emit();
};

export const appendChatMessage = (message: ChatMessage) => {
  snapshot = { ...snapshot, messages: [...snapshot.messages, message] };
  persist();
  emit();
};

export const clearChatHistory = () => {
  generation += 1;
  snapshot = { messages: [], pending: false };
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
  emit();
};
