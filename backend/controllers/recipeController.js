require("dotenv").config();

const axios = require("axios");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const Category = require("../models/Category");
const User = require("../models/User");
const { CleanUnusedIngredients } = require("./ingredientController");
const { CleanUnusedCategories } = require("./categoryController");
const { cloudinary } = require("../config/cloudinary");
const {
  resolveIngredients,
  resolveIngredientsFast,
} = require("../utils/resolveIngredients");
const { translateIngredientCached } = require("../utils/translateFoodName");
const { hydrateIngredientImages } = require("../utils/hydrateIngredientImage");
const { hydrateCategoryImages } = require("../utils/hydrateCategoryImage");
const { slugifyRecipe, baseSlugify } = require("../utils/slugify");

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
      const query = await translateIngredientCached(name);

      const response = await axios.get("https://pixabay.com/api/", {
        params: {
          key: process.env.PIXABAY_API_KEY,
          q: `${query} food`,
          image_type: "photo",
          per_page: 3,
          safesearch: true,
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
    const resolvedIngredients = await resolveIngredientsFast(ingredients);

    // Résolution des catégories
    const newCategoryIds = [];
    const resolvedCategories = await Promise.all(
      categories.map(async (categoryName) => {
        let found = await Category.findOne({ name: categoryName });
        if (!found) {
          found = await Category.create({
            name: categoryName,
            slug: baseSlugify(categoryName),
          });
          newCategoryIds.push(found._id);
        }
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

    const slug = slugifyRecipe(recipe.name, recipe._id);
    recipe.slug = slug;
    await recipe.save();

    res.status(201).json({
      error: false,
      message: "Recette créée avec succès",
      data: recipe,
    });

    // 🚀 puis on lance les jobs en background (sans await)
    const ingredientIds = resolvedIngredients.map((i) => i.ingredient);
    hydrateIngredientImages(ingredientIds);
    hydrateCategoryImages(newCategoryIds);
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
      .populate("addedBy", "name _id");

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

exports.GetRecipeBySlug = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ slug: req.params.slug })
      .populate("categories")
      .populate("ingredients.ingredient")
      .populate("addedBy", "name _id");

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

exports.GetRecipeByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        error: true,
        message: "Catégorie non trouvée",
      });
    }

    const recipes = await Recipe.find({ categories: category._id })
      .populate("categories")
      .populate("ingredients.ingredient")
      .populate("addedBy", "name _id");

    return res.status(200).json({
      error: false,
      message: "Recettes trouvées avec succès",
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

// Get all recipes
exports.GetAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .populate("categories")
      .populate("ingredients.ingredient")
      .populate("addedBy", "name _id");

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

// Get all recipes by me
exports.GetAllRecipesByMe = async (req, res) => {
  try {
    const recipes = await Recipe.find({ addedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate("categories")
      .populate("ingredients.ingredient")
      .populate("addedBy", "name _id");

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

// Get all recipes by user Id
exports.GetAllRecipesByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const recipes = await Recipe.find({ addedBy: id })
      .sort({ createdAt: -1 })
      .populate("categories")
      .populate("ingredients.ingredient")
      .populate("addedBy", "name _id");

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
      const query = await translateIngredientCached(name);
      try {
        const response = await axios.get("https://pixabay.com/api/", {
          params: {
            key: process.env.PIXABAY_API_KEY,
            lang: "fr",
            q: `${query} food`,
            image_type: "photo",
            per_page: 3,
            safesearch: true,
          },
        });
        const pixabayUrl = response.data.hits[0]?.largeImageURL;
        if (pixabayUrl) {
          const cloudinaryRes = await cloudinary.uploader.upload(pixabayUrl, {
            folder: "recipes",
          });
          imageUrl = cloudinaryRes.secure_url;
        }
      } catch (pixabayError) {
        console.error("Erreur image recette:", pixabayError);
        // fallback : garder l'ancienne image ou null
      }
    }

    // Résolution des ingrédients
    const resolvedIngredients = await resolveIngredientsFast(ingredients);

    // Résolution des catégories
    const newCategoryIds = [];
    const resolvedCategories = await Promise.all(
      categories.map(async (categoryName) => {
        let found = await Category.findOne({ name: categoryName });
        if (!found) {
          found = await Category.create({
            name: categoryName,
            slug: baseSlugify(categoryName),
          });
          newCategoryIds.push(found._id);
        }
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

    if (name && name !== recipe.name) {
      updateData.slug = slugifyRecipe(name, recipe._id);
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("categories")
      .populate("ingredients.ingredient");

    res.status(200).json({
      error: false,
      message: "Recette mise à jour avec succès",
      data: updatedRecipe,
    });
    const ingredientIds = resolvedIngredients.map((i) => i.ingredient);
    hydrateIngredientImages(ingredientIds);
    hydrateCategoryImages(newCategoryIds);
    CleanUnusedIngredients();
    CleanUnusedCategories();
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

    // Supprimer l'image Cloudinary si elle existe
    if (recipe.image) {
      try {
        // Extraire le public_id de l'URL Cloudinary
        const urlParts = recipe.image.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `recipes/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Erreur suppression image recette:", cloudinaryError);
        // Ne pas bloquer la suppression si l'image ne peut pas être supprimée
      }
    }

    await Recipe.findByIdAndDelete(id);

    await User.updateMany(
      { "savedRecipes.recipe": req.params.id },
      { $pull: { savedRecipes: { recipe: req.params.id } } },
    );

    await User.updateMany(
      { "savedIngredients.recipe": req.params.id },
      { $pull: { savedIngredients: { recipe: req.params.id } } },
    );

    await CleanUnusedIngredients();
    await CleanUnusedCategories();

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
