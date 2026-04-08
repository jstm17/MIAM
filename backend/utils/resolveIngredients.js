const Ingredient = require("../models/Ingredient");
const {
  fetchAndUploadIngredientImage,
} = require("./fetchAndUploadIngredientImage");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resolveIngredients = async (ingredients) => {
  const resolved = [];

  for (const { ingredient, quantity } of ingredients) {
    let found = await Ingredient.findOne({ name: ingredient });

    if (!found) {
      const url = await fetchAndUploadIngredientImage(ingredient);
      found = await Ingredient.create({ name: ingredient, url });
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

const resolveIngredientsFast = async (ingredients) => {
  const resolved = [];

  for (const { ingredient, quantity } of ingredients) {
    let found = await Ingredient.findOne({ name: ingredient });

    if (!found) {
      // on crée sans image
      found = await Ingredient.create({
        name: ingredient,
        url: null,
      });
    }

    resolved.push({ ingredient: found._id, quantity });
  }

  return resolved;
};

module.exports = { resolveIngredients, resolveIngredientsFast };
