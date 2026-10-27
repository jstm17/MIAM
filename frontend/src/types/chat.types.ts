export type RecipeDraft = {
  name: string;
  categories: string[];
  personsNumber?: number;
  timePrep?: number;
  timeCook?: number;
  ingredients: { ingredient: string; quantity: string }[];
  instructions: { content: string }[];
};

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type ChatMessage = ChatTurn & {
  recipe?: RecipeDraft | null;
};
