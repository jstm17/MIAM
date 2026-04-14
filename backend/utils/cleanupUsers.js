const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

exports.CleanUsersOrphanData = async () => {
  try {
    console.log("🧹 Cleaning users orphan data...");

    // 1️⃣ récupérer les ids encore existants
    const existingRecipeIds = await Recipe.distinct("_id");
    const existingIngredientIds = await Ingredient.distinct("_id");

    // 2️⃣ supprimer recettes sauvegardées inexistantes
    await User.updateMany(
      {},
      {
        $pull: {
          savedRecipes: {
            recipe: { $nin: existingRecipeIds },
          },
        },
      },
    );

    // 3️⃣ supprimer ingrédients sauvegardés inexistants (recette supprimée)
    await User.updateMany(
      {},
      {
        $pull: {
          savedIngredients: {
            recipe: { $nin: existingRecipeIds },
          },
        },
      },
    );

    // 4️⃣ supprimer ingrédients supprimés
    await User.updateMany(
      {},
      {
        $pull: {
          savedIngredients: {
            ingredient: { $nin: existingIngredientIds },
          },
        },
      },
    );

    console.log("✅ Users cleaned");
  } catch (err) {
    console.error("❌ CleanUsersOrphanData error", err);
  }
};
