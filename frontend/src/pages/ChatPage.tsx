import { ChatHeader } from "@/components/chat/ChatHeader";
import { Layout } from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAskRecipe } from "@/hooks/chat/useAskRecipe";
import { useAuth } from "@/hooks/useAuth";
import { useKeyboardOpen } from "@/hooks/useKeyboardOpen";
import type { RecipeDraft } from "@/types/chat.types";
import {
  appendChatMessage,
  getChatGeneration,
  getChatSnapshot,
  setChatPending,
  subscribeChat,
} from "@/utils/chatHistory";
import { replaceRecipeFormDraft } from "@/utils/formDraft";
import { getSuggestionNames } from "@/utils/suggestionsChat";
import { Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ChatPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { askRecipe } = useAskRecipe();
  const { messages, pending } = useSyncExternalStore(
    subscribeChat,
    getChatSnapshot,
    getChatSnapshot,
  );
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const suggestionRequestRef = useRef<Promise<string[]> | null>(null);
  const keyboardOpen = useKeyboardOpen();

  useEffect(() => {
    if (messages.length > 0) {
      suggestionRequestRef.current = null;
      return;
    }

    let active = true;
    suggestionRequestRef.current ??= getSuggestionNames(askRecipe);
    setSuggestions([]);
    setSuggestionsLoading(true);
    suggestionRequestRef.current
      .then(setSuggestions)
      .catch((error: unknown) => {
        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Impossible de générer les suggestions.",
          );
        }
      })
      .finally(() => {
        if (active) setSuggestionsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [askRecipe, messages.length]);

  const composerOffset = keyboardOpen
    ? `0`
    : `calc(${isAdmin ? "108px" : "58px"} + env(safe-area-inset-bottom))`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || getChatSnapshot().pending) return;

    const history = [
      ...getChatSnapshot().messages.map(({ role, content: previous }) => ({
        role,
        content: previous,
      })),
      { role: "user" as const, content },
    ];
    const session = getChatGeneration();

    appendChatMessage({ role: "user", content });
    setInput("");
    setChatPending(true);

    try {
      const data = await askRecipe(history);
      if (getChatGeneration() !== session) return;
      appendChatMessage({
        role: "assistant",
        content: data.text,
        recipe: data.recipe,
      });
    } catch (err: unknown) {
      if (getChatGeneration() !== session) return;
      const message =
        err instanceof Error
          ? err.message
          : "Zest n'a pas pu répondre. Réessayez dans un instant.";
      appendChatMessage({ role: "assistant", content: message });
    } finally {
      if (getChatGeneration() === session) setChatPending(false);
    }
  };

  const addRecipe = (recipe: RecipeDraft) => {
    replaceRecipeFormDraft(recipe);
    navigate("/add", { state: { draft: recipe } });
  };

  return (
    <Layout className="px-4 pt-4 gap-3 relative">
      <ChatHeader empty={messages.length === 0} />
      <div
        className={`flex flex-1  overflow-y-auto flex-col gap-3 pt-16 relative ${keyboardOpen && "bottom-0"}`}
        style={{ paddingBottom: composerOffset }}
      >
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
            <Sparkles className="size-8 text-primary" />
            <p className="text-muted-foreground">
              Demandez à Zest ce que vous voulez : une recette, des conseils de
              cuisine, etc...
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="outline"
                  onClick={() => send(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
              {suggestionsLoading && <Spinner />}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={
              message.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={
                message.role === "user"
                  ? "max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-primary-foreground whitespace-pre-wrap"
                  : "flex max-w-[95%] flex-col gap-3"
              }
            >
              <p
                className={
                  message.role === "assistant"
                    ? "rounded-2xl bg-muted px-3 py-2 whitespace-pre-wrap leading-relaxed"
                    : "whitespace-pre-wrap"
                }
              >
                {message.content}
              </p>
              {message.recipe && (
                <Button
                  type="button"
                  className="self-start"
                  onClick={() => addRecipe(message.recipe!)}
                >
                  Ajouter cette recette
                </Button>
              )}
            </div>
          </div>
        ))}

        {pending && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner />
            Zest réfléchit…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="fixed inset-x-0 z-10 mx-auto flex max-w-lg items-end gap-2 border-t bg-background px-4 py-2"
        style={{ bottom: composerOffset }}
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        <Textarea
          value={input}
          placeholder="Ex. Recette tarte aux pommes"
          className="min-h-6 max-h-32 flex-1"
          rows={1}
          disabled={pending}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send(input);
            }
          }}
        />
        <Button
          type="submit"
          size="icon-xl"
          disabled={pending || !input.trim()}
          aria-label="Envoyer"
          onPointerDown={(event) => {
            if (event.pointerType === "touch") event.preventDefault();
          }}
        >
          <Send />
        </Button>
      </form>
    </Layout>
  );
};
