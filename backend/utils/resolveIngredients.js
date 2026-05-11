const Ingredient = require("../models/Ingredient");
const {
  fetchAndUploadIngredientImage,
} = require("./fetchAndUploadIngredientImage");
const { translateIngredientCached } = require("./translateIngredientCached");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  let name = word.trim();

  // 1. Exceptions courantes (Ingrédients)
  const exceptions = {
    'ails': 'ail',
    'choux': 'chou',
    'couscous': 'couscous',
  };

 const singularizeWord = (w) => {
    if (exceptions[w]) return exceptions[w];

    if (w.endsWith('aux')) return w.slice(0, -3) + 'al';

    if ((w.endsWith('s') || w.endsWith('x')) && w.length > 3) {
      return w.slice(0, -1);
    }

    return w;
  };

  const words = word.trim().split(' ');
  const singularized = words.map((w) => singularizeWord(w)).join(' ');

  return singularized[0].toUpperCase() + singularized.slice(1);
};

const normalizeIngredientName = (str) => {
  if (!str) return "";

  return (
    str
      .toLowerCase()
      .trim()
      // 1. Retirer les parenthèses et leur contenu en premier
      .replace(/\(.*?\)/g, '')
      .trim()
      // 2. Gérer les ligatures comme œ et æ
      .replace(/œ/g, "oe")
      .replace(/æ/g, "ae")
      // 3. Gérer les pluriels en -aux (ex: poireaux -> poireau) AVANT le -s
      .replace(/(.+)eaux$/, "$1eau")
      .replace(/(.+)aux$/, "$1al")
      // 4. Gérer le pluriel simple (retrait du 's' final)
      .replace(/(.{3,})s$/, "$1")
  );
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
