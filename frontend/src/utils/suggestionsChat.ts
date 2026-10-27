import type { ChatTurn } from "@/types/chat.types";

export const parseSuggestions = (text: string) =>
  [
    ...new Set(
      text
        .split(/\r?\n/)
        .map((line) =>
          line.replace(/^\s*(?:(?:[-*•])\s*|\d+[.)]\s*)/, "").trim(),
        )
        .filter(Boolean),
    ),
  ].slice(0, 3);

export const SUGGESTIONS_PROMPT =
  "Propose exactement trois idées de recettes variées et choisies au hasard. " +
  "Réponds uniquement avec leurs noms, un par ligne, sans numérotation, sans puces, " +
  "sans description et sans recette détaillée.";

const DEFAULT_SUGGESTIONS = [
  "Tarte aux pommes",
  "Gratin dauphinois",
  "Crêpes",
];

export const getSuggestionNames = async (
  askRecipe: (messages: ChatTurn[]) => Promise<{
    text: string;
  }>,
) => {
  try {
    const { text } = await askRecipe([
      { role: "user", content: SUGGESTIONS_PROMPT },
    ]);
    const suggestions = parseSuggestions(text);
    if (suggestions.length === 3) return suggestions;

    console.warn("Zest n'a pas généré trois suggestions.");
  } catch (error: unknown) {
    console.error("Impossible de générer les suggestions avec Zest.", error);
  }

  return DEFAULT_SUGGESTIONS;
};
