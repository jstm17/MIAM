const Ingredient = require("../models/Ingredient");
const { normalizeIngredientName } = require("./normalizeIngredientName");
const { FOOD_DICTIONARY } = require("./foodDictionary");
const { translate } = require("@vitalets/google-translate-api");

const translateIngredientCached = async (name) => {
  const normalized = normalizeIngredientName(name);

  // 1️⃣ dictionnaire local PRIORITAIRE
  if (FOOD_DICTIONARY[normalized]) {
    return FOOD_DICTIONARY[normalized];
  }

  // 2️⃣ cache DB
  let ingredient = await Ingredient.findOne({ normalizedName: normalized });
  if (ingredient?.englishName) {
    return ingredient.englishName;
  }

  // 3️⃣ fallback traduction (rare maintenant)
  try {
    const res = await translate(normalized, { to: "en" });
    const translated = res.text.toLowerCase();

    await Ingredient.findOneAndUpdate(
      { normalizedName: normalized },
      {
        name,
        normalizedName: normalized,
        englishName: translated,
      },
      { upsert: true },
    );

    return translated;
  } catch (err) {
    console.log("Traduction failed, fallback:", normalized);
    return normalized;
  }
};

module.exports = { translateIngredientCached };
