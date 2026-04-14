require("dotenv").config();
const mongoose = require("mongoose");

const axios = require("axios");
const Recipe = require("../models/Recipe");
const Category = require("../models/Category");
const User = require("../models/User");
const { CleanUsersOrphanData } = require("../utils/cleanupUsers");
const { CleanUnusedIngredients } = require("./ingredientController");
const { CleanUnusedCategories } = require("./categoryController");
const { cloudinary } = require("../config/cloudinary");
const { resolveIngredientsFast } = require("../utils/resolveIngredients");
const { resolveCategories } = require("../utils/resolveCategories");
const { hydrateIngredientImages } = require("../utils/hydrateIngredientImage");
const { hydrateCategoryImages } = require("../utils/hydrateCategoryImage");
const { slugifyRecipe } = require("../utils/slugify");
const {
  fetchAndUploadRecipeImage,
} = require("../utils/fetchAndUploadRecipeImage");
const { compressAndUploadImage } = require("../utils/imageUpload");
const { deleteImageFromCloudinary } = require("../utils/cloudinaryUtils");

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

    const imageUrl = req.file
      ? await compressAndUploadImage(req.file.buffer, "recipes")
      : await fetchAndUploadRecipeImage(name);

    const resolvedIngredients = await resolveIngredientsFast(ingredients);
    const { resolvedCategories, newCategoryIds } =
      await resolveCategories(categories);

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

    recipe.slug = slugifyRecipe(recipe.name, recipe._id);
    await recipe.save();

    res.status(201).json({
      error: false,
      message: "Recette créée avec succès",
      data: recipe,
    });

    // jobs en background
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
    const recipe = await Recipe.findOne(req.params)
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

exports.GetAllRecipesByCategory = async (req, res) => {
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

exports.GetAllRecipesVisiblesByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        error: true,
        message: "Catégorie non trouvée",
      });
    }

    const userId = req.user?.id;
    const filter = userId
      ? {
          categories: category._id,
          $or: [{ visible: true }, { addedBy: userId }],
        }
      : {
          categories: category._id,
          visible: true,
        };

    const recipes = await Recipe.find(filter)
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

// Get visible recipes from others and all recipes from the authenticated user
exports.GetAllRecipesVisibles = async (req, res) => {
  try {
    const userId = req.user?.id;
    const filter = userId
      ? {
          $or: [
            { visible: true, addedBy: { $ne: userId } },
            { addedBy: userId },
          ],
        }
      : { visible: true };

    const recipes = await Recipe.find(filter)
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
    const { id } = req.params;
    const { name, time, personsNumber } = req.body;
    const categories = JSON.parse(req.body.categories);
    const ingredients = JSON.parse(req.body.ingredients);
    const instructions = JSON.parse(req.body.instructions);

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res
        .status(404)
        .json({ error: true, message: "Recette non trouvée" });
    }

    if (recipe.addedBy.toString() !== req.user.id) {
      return res.status(403).json({
        error: true,
        message: "Vous n'êtes pas autorisé à modifier cette recette",
      });
    }

    const oldIngredientIds = recipe.ingredients.map((i) =>
      i.ingredient.toString(),
    );

    let imageUrl = recipe.image;
    if (req.file) {
      if (recipe.image) {
        await deleteImageFromCloudinary(recipe.image);
      }
      imageUrl = await compressAndUploadImage(req.file.buffer, "recipes");
    } else if (!req.body.image) {
      const fetchedUrl = await fetchAndUploadRecipeImage(name);
      if (fetchedUrl) {
        if (recipe.image) {
          await deleteImageFromCloudinary(recipe.image);
        }
        imageUrl = fetchedUrl;
      }
    }

    const resolvedIngredients = await resolveIngredientsFast(ingredients);
    const { resolvedCategories, newCategoryIds } =
      await resolveCategories(categories);

    const newIngredientIds = resolvedIngredients.map((i) =>
      i.ingredient.toString(),
    );

    const removedIngredientIds = oldIngredientIds.filter(
      (id) => !newIngredientIds.includes(id),
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
      returnDocument: "after",
    })
      .populate("categories")
      .populate("ingredients.ingredient");

    if (removedIngredientIds.length > 0) {
      const removedIngredientObjectIds = removedIngredientIds.map(
        (id) => new mongoose.Types.ObjectId(id),
      );
      await User.updateMany(
        {},
        {
          $pull: {
            savedIngredients: {
              recipe: recipe._id,
              ingredient: { $in: removedIngredientObjectIds },
            },
          },
        },
      );
    }

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
    CleanUsersOrphanData();
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
      await deleteImageFromCloudinary(recipe.image);
    }

    const recipeObjectId = new mongoose.Types.ObjectId(req.params.id);
    await Recipe.findByIdAndDelete(id);

    await User.updateMany(
      { "savedRecipes.recipe": recipeObjectId },
      { $pull: { savedRecipes: { recipe: recipeObjectId } } },
    );

    await User.updateMany(
      { "savedIngredients.recipe": recipeObjectId },
      { $pull: { savedIngredients: { recipe: recipeObjectId } } },
    );

    await CleanUnusedIngredients();
    await CleanUnusedCategories();
    await CleanUsersOrphanData();
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

exports.ShowRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { visible: true },
      { returnDocument: "after" },
    );
    if (!recipe)
      return res
        .status(404)
        .json({ error: true, message: "Recette non trouvée" });
    return res
      .status(200)
      .json({ error: false, message: "Recette visible", data: recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.HideRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { visible: false },
      { returnDocument: "after" },
    );
    if (!recipe)
      return res
        .status(404)
        .json({ error: true, message: "Recette non trouvée" });
    return res
      .status(200)
      .json({ error: false, message: "Recette masquée", data: recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};
