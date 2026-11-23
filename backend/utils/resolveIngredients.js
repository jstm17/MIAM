const Ingredient = require("../models/Ingredient");
const {
  fetchAndUploadIngredientImage,
} = require("./fetchAndUploadIngredientImage");
const { translateIngredientCached } = require("./translateIngredientCached");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const exceptions = {
  ails: "ail",
  choux: "chou",
  couscous: "couscous",
  épices: "épices",
};

const containsException = (name) =>
  (name.match(/[\p{L}]+/gu) || []).some((word) =>
    Object.prototype.hasOwnProperty.call(exceptions, word),
  );

const normalizeWord = (word, preservePlural = false) => {
  if (word === "aux") return word;

  const normalized = word.replace(/œ/g, "oe").replace(/æ/g, "ae");
  if (preservePlural) return normalized;

  return normalized
    .replace(/(.+)eaux$/, "$1eau")
    .replace(/(.+)aux$/, "$1al")
    .replace(/(.{3,})s$/, "$1");
};

const isAfterPluralPreservingPreposition = (words, index) =>
  index > 0 && (words[index - 1] === "de" || words[index - 1] === "à");

const resolveIngredients = async (ingredients) => {
  const resolved = [];

  for (const { ingredient, quantity } of ingredients) {
    let found = await Ingredient.findOne({ name: ingredient });

    if (!found) {
      const url = await fetchAndUploadIngredientImage(ingredient);
      found = await Ingredient.create({
        name: ingredient,
        url,
      });
    } else if (!found.url) {
      const url = await fetchAndUploadIngredientImage(ingredient);
      await Ingredient.findByIdAndUpdate(found._id, { url });
      found.url = url;
    }

    resolved.push({ ingredient: found._id, quantity });
    await sleep(1000); // 1s entre chaque ingrédient
  }

  return resolved;
};

const singularizeFrench = (word) => {
  if (!word) return "";

  const name = word.trim();

  const singularizeWord = (w) => {
    if (Object.prototype.hasOwnProperty.call(exceptions, w)) return exceptions[w];

    if (w.endsWith('aux')) return w.slice(0, -3) + 'al';

    if ((w.endsWith('s') || w.endsWith('x')) && w.length > 3) {
      return w.slice(0, -1);
    }

    return w;
  };

  const words = name.split(/\s+/);
  if (words.length > 1 && containsException(name)) {
    const singularized = words
      .map((w, index) =>
        Object.prototype.hasOwnProperty.call(exceptions, w) || w === "aux"
          ? w
          : normalizeWord(w, isAfterPluralPreservingPreposition(words, index)),
      )
      .join(" ");
    return singularized[0].toUpperCase() + singularized.slice(1);
  }

  const singularized = words
    .map((w, index) =>
      isAfterPluralPreservingPreposition(words, index) ? w : singularizeWord(w),
    )
    .join(" ");

  return singularized[0].toUpperCase() + singularized.slice(1);
};

const normalizeIngredientName = (str) => {
  if (!str) return "";

  const cleaned = str.toLowerCase().trim().replace(/\(.*?\)/g, "").trim();
  const words = cleaned.split(/\s+/);
  if (words.length > 1) {
    return words
      .map((word, index) =>
        Object.prototype.hasOwnProperty.call(exceptions, word) || word === "aux"
          ? word
          : normalizeWord(word, isAfterPluralPreservingPreposition(words, index)),
      )
      .join(" ");
  }
  if (Object.prototype.hasOwnProperty.call(exceptions, cleaned)) {
    return exceptions[cleaned];
  }

  return normalizeWord(cleaned);
};

const resolveIngredientsFast = async (ingredients) => {
  const resolved = [];

  for (const item of ingredients) {
    const rawLabel = item.ingredient; // "Œufs"
    const normalized = normalizeIngredientName(rawLabel); // deviendra "oeuf"
    const singularizedName = singularizeFrench(normalized);
    // Recherche par le nom normalisé
    let ingredientDoc = await Ingredient.findOne({ normalizedName: normalized });

    if (!ingredientDoc) {
      // Si on doit le créer, on utilise le nom normalisé comme base propre
      ingredientDoc = await Ingredient.create({
        name: singularizedName,
        normalizedName: normalized
      });
    }

    resolved.push({
      ingredient: ingredientDoc._id,
      quantity: item.quantity,
      label: rawLabel // L'affichage reste tel que l'utilisateur l'a écrit
    });
  }

  return resolved;
};

module.exports = { resolveIngredients, resolveIngredientsFast };
