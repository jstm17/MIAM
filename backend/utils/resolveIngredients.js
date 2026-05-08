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

  let name = word.toLowerCase().trim();

  // 1. Exceptions courantes (Ingrédients)
  const exceptions = {
    'ails': 'ail',
    'choux': 'chou',
  };

  if (exceptions[name]) return exceptions[name];

  // 2. Mots se terminant par -aux (ex: journaux -> journal)
  if (name.endsWith('aux')) {
    return name.slice(0, -3) + 'al';
  }

  // 3. Mots se terminant par -s ou -x (le plus courant : carottes, oignons)
  // On vérifie que le mot est assez long pour ne pas tronquer des mots comme "os" или "riz"
  if ((name.endsWith('s') || name.endsWith('x')) && name.length > 3) {
    // Cas particulier : si le mot finit déjà par -es (ex: pommes), on enlève juste le -s
    // Mais en français, l'ingrédient de base est souvent au singulier sans le s.
    return name.slice(0, -1);
  }

  return name;
};

const normalizeIngredientName = (str) => {
  if (!str) return "";

  return (
    str
      .toLowerCase()
      .trim()
      // 1. Gérer les ligatures comme œ et æ
      .replace(/œ/g, "oe")
      .replace(/æ/g, "ae")
      // 3. Gérer le pluriel simple (retrait du 's' final)
      // On ne le fait que si le mot est assez long pour éviter de casser "os" ou "as"
      .replace(/(.+)(s)$/, "$1")
      // 4. Gérer les pluriels en -aux (ex: poireaux -> poireau)
      .replace(/(.+)eaux$/, "$1eau")
      .replace(/(.+)aux$/, "$1al")
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
