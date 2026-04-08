const Ingredient = require("../models/Ingredient");
const {
  fetchAndUploadIngredientImage,
} = require("./fetchAndUploadIngredientImage");

const hydrateIngredientImages = async (ingredientIds) => {
  console.log("JOB: récupération images ingrédients...");

  for (const id of ingredientIds) {
    const ingredient = await Ingredient.findById(id);

    if (!ingredient || ingredient.url) continue;

    try {
      const url = await fetchAndUploadIngredientImage(ingredient.name);

      await Ingredient.findByIdAndUpdate(id, {
        url,
        imageStatus: "done",
      });

      await sleep(1000); // rate limit pixabay
    } catch (err) {
      console.error("Erreur image:", ingredient.name);
    }
  }

  console.log("JOB terminé !");
};

module.exports = { hydrateIngredientImages };
