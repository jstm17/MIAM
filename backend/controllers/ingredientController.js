const Ingredient = require("../models/Ingredient");
const Recipe = require("../models/Recipe");

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
    await Ingredient.deleteMany({ _id: { $nin: usedIngredientIds } });
  } catch (error) {
    console.error("Erreur nettoyage ingrédients:", error);
  }
};
