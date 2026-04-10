const Ingredient = require("../models/Ingredient");
const Recipe = require("../models/Recipe");
const { cloudinary } = require("../config/cloudinary");

exports.GetAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    return res.status(200).json({
      error: false,
      message: "Ingrédients récupérés avec succès",
      data: ingredients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

exports.GetAllIngredientsVisibles = async (req, res) => {
  try {
    const userId = req.user?.id;
    const filter = userId
      ? {
          $or: [{ visible: true }, { addedBy: userId }],
        }
      : { visible: true };

    const ingredientIds = await Recipe.distinct(
      "ingredients.ingredient",
      filter,
    );
    const ingredients = await Ingredient.find({
      _id: { $in: ingredientIds },
    }).sort({ name: 1 });

    return res.status(200).json({
      error: false,
      message: "Ingrédients récupérés avec succès",
      data: ingredients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

exports.CreateIngredient = async (req, res) => {
  try {
    const { name } = req.body;

    let ingredient = await Ingredient.findOne({ name });
    if (ingredient) {
      return res.status(200).json({ error: false, data: ingredient });
    }

    ingredient = await Ingredient.create({ name });
    return res.status(201).json({ error: false, data: ingredient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.CleanUnusedIngredients = async () => {
  try {
    const usedIngredientIds = await Recipe.distinct("ingredients.ingredient");

    // Récupérer les ingrédients qui vont être supprimés
    const ingredientsToDelete = await Ingredient.find({
      _id: { $nin: usedIngredientIds },
      url: { $exists: true, $ne: null },
    });

    // Supprimer les images Cloudinary
    for (const ingredient of ingredientsToDelete) {
      if (ingredient.url) {
        try {
          // Extraire le public_id de l'URL Cloudinary
          const urlParts = ingredient.url.split("/");
          const filename = urlParts[urlParts.length - 1];
          const publicId = `ingredients/${filename.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error(
            "Erreur suppression image ingrédient:",
            ingredient.name,
            cloudinaryError,
          );
        }
      }
    }

    await Ingredient.deleteMany({ _id: { $nin: usedIngredientIds } });
  } catch (error) {
    console.error("Erreur nettoyage ingrédients:", error);
  }
};
