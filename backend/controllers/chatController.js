const axios = require("axios");
const {
  getQuota,
  canUseModel,
  addTokensUsed,
  quotaExceededMessage,
} = require("../utils/chatQuota");

const SYSTEM_PROMPT = `Tu t'appelles Zest et tu es un cuisinier professionnel.
Réponds uniquement avec un objet JSON, sans texte autour, de cette forme :
{
  "text": "réponse en texte clair, sans markdown et sans JSON",
  "recipe": {
    "name": "nom du plat",
    "categories": ["Dessert"],
    "personsNumber": 6,
    "timePrep": 30,
    "timeCook": 40,
    "ingredients": [{ "ingredient": "Pommes", "quantity": "4" }],
    "instructions": [{ "content": "Préchauffer le four à 180 °C." }]
  }
}
Règles :
- timePrep et timeCook sont des durées en minutes, nombres entiers.
- personsNumber est un entier.
- Le texte et les champs de recipe décrivent exactement la même recette.
- Propose des quantités cohérentes pour un plat cuisinable.
- Si le message demande une recette, remplis recipe et rédige text avec des retours à la ligne : titre, ligne vide, nombre de personnes, préparation, cuisson, ligne vide, « Ingrédients », un ingrédient par ligne, ligne vide, « Étapes », une étape numérotée par ligne.
- Si le message ne demande pas une recette, réponds dans text et mets recipe à null.`;

const toInt = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return undefined;
  return Math.round(number);
};

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeRecipe = (raw) => {
  if (!raw || typeof raw !== "object") return null;

  const name = cleanString(raw.name);
  if (!name) return null;

  const categories = Array.isArray(raw.categories)
    ? [...new Set(raw.categories.map(cleanString).filter(Boolean))]
    : [];

  const ingredients = Array.isArray(raw.ingredients)
    ? raw.ingredients
        .map((item) => ({
          ingredient: cleanString(item?.ingredient),
          quantity: cleanString(item?.quantity),
        }))
        .filter((item) => item.ingredient || item.quantity)
    : [];

  const instructions = Array.isArray(raw.instructions)
    ? raw.instructions
        .map((item) => ({
          content: cleanString(typeof item === "string" ? item : item?.content),
        }))
        .filter((item) => item.content)
    : [];

  return {
    name,
    categories: categories.length ? categories : ["Autre"],
    personsNumber: toInt(raw.personsNumber),
    timePrep: toInt(raw.timePrep),
    timeCook: toInt(raw.timeCook),
    ingredients,
    instructions,
  };
};

const formatRecipeText = (recipe) => {
  const lines = [recipe.name, ""];

  if (recipe.personsNumber) {
    lines.push(
      `Pour ${recipe.personsNumber} personne${recipe.personsNumber > 1 ? "s" : ""}`,
    );
  }
  if (recipe.timePrep != null)
    lines.push(`Préparation : ${recipe.timePrep} min`);
  if (recipe.timeCook != null) lines.push(`Cuisson : ${recipe.timeCook} min`);
  lines.push("");

  if (recipe.ingredients.length) {
    lines.push("Ingrédients");
    for (const item of recipe.ingredients) {
      lines.push(
        `- ${[item.quantity, item.ingredient].filter(Boolean).join(" ")}`,
      );
    }
    lines.push("");
  }

  if (recipe.instructions.length) {
    lines.push("Étapes");
    recipe.instructions.forEach((step, index) => {
      lines.push(`${index + 1}. ${step.content}`);
    });
  }

  return lines.join("\n").trim();
};

const GEMINI_MODELS = ["gemini-3.5-flash-lite", "gemini-3.6-flash"];

const requestGemini = async (messages) => {
  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  };

  let lastError;
  for (const model of GEMINI_MODELS) {
    try {
      return await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        body,
        {
          headers: {
            "x-goog-api-key": process.env.GEMINI_API_KEY,
            "Content-Type": "application/json",
          },
          timeout: 25000,
        },
      );
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      const overloaded =
        status === 404 ||
        status === 503 ||
        status === 429 ||
        error.code === "ECONNABORTED";
      if (!overloaded) throw error;
    }
  }

  throw lastError;
};

const parseModelJson = (content) => {
  const trimmed = String(content || "").trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  return JSON.parse(fenced ? fenced[1] : trimmed);
};

exports.AskRecipe = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY manquante");
      return res.status(503).json({
        error: true,
        message: "Zest est indisponible pour le moment.",
      });
    }

    const incoming = Array.isArray(req.body.messages) ? req.body.messages : [];
    const messages = incoming
      .filter(
        (message) =>
          message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim(),
      )
      .slice(-8)
      .map((message) => ({
        role: message.role,
        content: message.content.trim().slice(0, 6000),
      }));

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return res.status(400).json({
        error: true,
        message: "Écrivez votre message.",
      });
    }

    if (lastMessage.content.length > 500) {
      return res.status(400).json({
        error: true,
        message: "Le message est trop long.",
      });
    }

    const quota = await getQuota();
    if (!canUseModel(quota)) {
      return res.status(429).json({
        error: true,
        message: quotaExceededMessage(quota.resetLabel),
      });
    }

    const response = await requestGemini(messages);

    const content = response.data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("");
    const reportedTokens = Number(
      response.data?.usageMetadata?.totalTokenCount,
    );
    const tokensUsed =
      Number.isFinite(reportedTokens) && reportedTokens > 0
        ? reportedTokens
        : Math.ceil(
            (SYSTEM_PROMPT.length +
              messages.reduce(
                (total, message) => total + message.content.length,
                0,
              ) +
              String(content || "").length) /
              4,
          );
    await addTokensUsed(quota.period, tokensUsed);

    const parsed = parseModelJson(content);
    const recipe = normalizeRecipe(parsed?.recipe);
    const text = recipe ? formatRecipeText(recipe) : cleanString(parsed?.text);
    if (!text) {
      return res.status(502).json({
        error: true,
        message: "Zest n'a pas pu répondre.",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Réponse prête",
      data: {
        text,
        recipe,
      },
    });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    const status = error?.response?.status;
    const message =
      status === 401 || status === 403
        ? "Zest est indisponible pour le moment."
        : status === 429 || status === 503
          ? "Zest est très sollicité. Réessayez dans un instant."
          : "Zest n'a pas pu répondre. Réessayez dans un instant.";
    return res.status(status === 429 || status === 503 ? 503 : 502).json({
      error: true,
      message,
    });
  }
};
