const Ingredient = require("../models/Ingredient");
const { translateToEnglish } = require("./translate");

const translateIngredientCached = async (name) => {
  let ingredient = await Ingredient.findOne({ name });
  if (ingredient?.englishName) {
    return ingredient; // retourne le document complet
  }

  const translated = await translateToEnglish(name);
  ingredient = await Ingredient.findOneAndUpdate(
    { name },
    { name, englishName: translated },
    { upsert: true, returnDocument: "after" },
  );
  return ingredient;
};

module.exports = { translateIngredientCached };
