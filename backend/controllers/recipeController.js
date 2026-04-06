require("dotenv").config();

const axios = require("axios");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const Category = require("../models/Category");
const User = require("../models/User");
const { CleanUnusedIngredients } = require("./ingredientController");
const { cloudinary } = require("../config/cloudinary");

// Create recipe
exports.CreateRecipe = async (req, res) => {
  try {
    const { name, time, personsNumber } = req.body;
    const categories = JSON.parse(req.body.categories);
    const ingredients = JSON.parse(req.body.ingredients);
    const instructions = JSON.parse(req.body.instructions);

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

    let imageUrl = req.file?.path || null;

    if (!imageUrl) {
      const response = await axios.get("https://pixabay.com/api/", {
        params: {
          key: process.env.PIXABAY_API_KEY,
          q: name,
          image_type: "photo",
          per_page: 3,
        },
      });
      const pixabayUrl = response.data.hits[0]?.largeImageURL;
      if (pixabayUrl) {
        const cloudinaryRes = await cloudinary.uploader.upload(pixabayUrl, {
          folder: "recipes",
        });
        imageUrl = cloudinaryRes.secure_url;
      }
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
      image: imageUrl,
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
    const recipe = await Recipe.findById(req.params.id)
      .populate("categories")
      .populate("ingredients.ingredient")
      .populate("addedBy", "name");

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
      .sort({ createdAt: -1 })
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
      .sort({ createdAt: -1 })
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
    const { id } = req.params; // 👈 manquait
    const { name, time, personsNumber } = req.body; // 👈 manquait
    const categories = JSON.parse(req.body.categories);
    const ingredients = JSON.parse(req.body.ingredients);
    const instructions = JSON.parse(req.body.instructions);

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        error: true,
        message: "Recette non trouvée",
      });
    }

    if (recipe.addedBy.toString() !== req.user.id) {
      return res.status(403).json({
        error: true,
        message: "Vous n'êtes pas autorisé à modifier cette recette",
      });
    }

    let imageUrl = recipe.image;

    if (req.file) {
      imageUrl = req.file.path;
    } else if (!req.body.image) {
      const response = await axios.get("https://pixabay.com/api/", {
        params: {
          key: process.env.PIXABAY_API_KEY,
          q: name,
          image_type: "photo",
          per_page: 3,
        },
      });
      const pixabayUrl = response.data.hits[0]?.largeImageURL;
      if (pixabayUrl) {
        const cloudinaryRes = await cloudinary.uploader.upload(pixabayUrl, {
          folder: "recipes",
        });
        imageUrl = cloudinaryRes.secure_url;
      }
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

    const updateData = {
      name,
      time,
      personsNumber,
      categories: resolvedCategories,
      ingredients: resolvedIngredients,
      instructions,
      image: imageUrl,
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("categories")
      .populate("ingredients.ingredient");

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

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        error: true,
        message: "Recette non trouvée",
      });
    }

    if (recipe.addedBy.toString() !== req.user.id) {
      return res.status(403).json({
        error: true,
        message: "Vous n'êtes pas autorisé à supprimer cette recette",
      });
    }

    await Recipe.findByIdAndDelete(id);

    await User.updateMany(
      { "savedRecipes.recipe": req.params.id },
      { $pull: { savedRecipes: { recipe: req.params.id } } },
    );

    await CleanUnusedIngredients();

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
