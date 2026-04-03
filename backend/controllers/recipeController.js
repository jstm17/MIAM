require("dotenv").config();

const axios = require("axios");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const Category = require("../models/Category");
const User = require("../models/User");

// Create recipe
exports.CreateRecipe = async (req, res) => {
  try {
    const {
      name,
      time,
      personsNumber,
      categories,
      ingredients,
      instructions,
      image,
    } = req.body;

    if (
      !name ||
      !time ||
      !personsNumber ||
      !categories ||
      !ingredients ||
      !instructions
    ) {
      return res.status(400).json({
        error: true,
        message: "Tous les champs sont requis",
      });
    }

    // Résolution de l'image
    let imageUrl = image;
    if (!imageUrl) {
      const pixabayRes = await axios.get("https://pixabay.com/api/", {
        params: {
          key: process.env.PIXABAY_API_KEY,
          q: name,
          image_type: "photo",
          per_page: 3,
        },
      });
      imageUrl = pixabayRes.data.hits[0]?.webformatURL || null;
      //       const pixabayUrl = pixabayRes.data.hits[0]?.largeImageURL;

      // if (pixabayUrl) {
      //   const cloudinaryRes = await cloudinary.uploader.upload(pixabayUrl, {
      //     folder: "recipes",
      //   });
      //   imageUrl = cloudinaryRes.secure_url; // URL Cloudinary permanente ✅
      // }
      // secure_url est une URL Cloudinary permanente qui n'expire jamais.
    }

    // Résolution des ingrédients
    const resolvedIngredients = await Promise.all(
      ingredients.map(async ({ ingredient, quantity }) => {
        let found = await Ingredient.findOne({ name: ingredient });
        if (!found) found = await Ingredient.create({ name: ingredient });
        return { ingredient: found._id, quantity };
      }),
    );

    // Résolution des catégories
    const resolvedCategories = await Promise.all(
      categories.map(async (categoryName) => {
        let found = await Category.findOne({ name: categoryName });
        if (!found) found = await Category.create({ name: categoryName });
        return found._id;
      }),
    );

    const recipe = new Recipe({
      name,
      time,
      personsNumber,
      categories: resolvedCategories,
      ingredients: resolvedIngredients,
      instructions,
      addedBy: req.user.id,
      image: imageUrl, // 👈
    });

    await recipe.save();

    return res.status(201).json({
      error: false,
      message: "Recette créée avec succès",
      data: recipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La recette n'a pas pu être créée",
    });
  }
};

// Get recipe by ID
exports.GetRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        error: true,
        message: "Recette non trouvée",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Recette trouvée avec succès",
      data: recipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La recette n'a pas pu être récupérée",
    });
  }
};

// Get all recipes
exports.GetAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("categories")
      .populate("ingredients.ingredient")
      .populate("addedBy", "name");

    return res.status(200).json({
      error: false,
      message: "Recettes récupérées avec succès",
      data: recipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - Les recettes n'ont pas pu être récupérées",
    });
  }
};

// Get all recipes by user
exports.GetAllRecipesByUser = async (req, res) => {
  try {
    const recipes = await Recipe.find({ addedBy: req.user.id })
      .populate("categories")
      .populate("ingredients.ingredient")
      .populate("addedBy", "name");

    return res.status(200).json({
      error: false,
      message: "Recettes récupérées avec succès",
      data: recipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - Les recettes n'ont pas pu être récupérées",
    });
  }
};

// Update recipe
exports.UpdateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ingredients, time, categories, instructions, personsNumber } =
      req.body;

    if (
      !name ||
      !ingredients ||
      !time ||
      !categories ||
      !instructions ||
      !personsNumber
    ) {
      return res.status(400).json({
        error: true,
        message: "Requête invalide",
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        name,
        ingredients,
        time,
        categories,
        instructions,
        personsNumber,
        image,
      },
      { new: true },
    );

    if (!updatedRecipe) {
      return res.status(404).json({
        error: true,
        message: "Recette non trouvée",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Recette mise à jour avec succès",
      data: updatedRecipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La mise à jour de la recette a échoué",
    });
  }
};

// Delete recipe
exports.DeleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({
        error: true,
        message: "Recette non trouvée",
      });
    }

    await User.updateMany(
      { savedRecipes: req.params.id },
      { $pull: { savedRecipes: req.params.id } },
    );

    return res.status(200).json({
      error: false,
      message: "Recette supprimée avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La suppression de la recette a échoué",
    });
  }
};
