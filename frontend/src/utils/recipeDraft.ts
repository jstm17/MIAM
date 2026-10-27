import type { RecipeDraft } from "@/types/chat.types";

export const isRecipeDraft = (value: unknown): value is RecipeDraft => {
  if (!value || typeof value !== "object") return false;
  const draft = value as RecipeDraft;
  return (
    typeof draft.name === "string" &&
    Array.isArray(draft.categories) &&
    Array.isArray(draft.ingredients) &&
    Array.isArray(draft.instructions)
  );
};

export const readRecipeDraft = (state: unknown): RecipeDraft | undefined => {
  const draft = (state as { draft?: unknown } | null)?.draft;
  return isRecipeDraft(draft) ? draft : undefined;
};
