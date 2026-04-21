const Ingredient = require("../models/Ingredient");
const Recipe = require("../models/Recipe");
const { cloudinary } = require("../config/cloudinary");

exports.GetAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });

    const ingredientsWithCount = await Promise.all(
      ingredients.map(async (ingredient) => {
        const recipesCount = await Recipe.countDocuments({
          "ingredients.ingredient": ingredient._id,
        });
        return { ...ingredient.toObject(), recipesCount };
      }),
    );

    return res.status(200).json({
      error: false,
      message: "Ingrédients récupérés avec succès",
      data: ingredientsWithCount,
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

exports.DeleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res
        .status(404)
        .json({ error: true, message: "Ingrédient non trouvé" });
    }

    // Supprimer l'image Cloudinary si elle existe
    if (ingredient.url) {
      try {
        const urlParts = ingredient.url.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `ingredients/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Erreur suppression image:", cloudinaryError);
      }
    }

    await Ingredient.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      error: false,
      message: "Ingrédient supprimé avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.ResetIngredientUrl = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res
        .status(404)
        .json({ error: true, message: "Ingrédient non trouvé" });
    }

    // Supprimer l'ancienne image Cloudinary
    if (ingredient.url) {
      try {
        const urlParts = ingredient.url.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `ingredients/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Erreur suppression image:", cloudinaryError);
      }
    }

    // Remettre l'url à null
    await Ingredient.findByIdAndUpdate(req.params.id, { url: null });

    return res.status(200).json({
      error: false,
      message: "URL réinitialisée avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.DeleteIngredients = async (req, res) => {
  try {
    const { ids } = req.body; // tableau d'ids

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Aucun ingrédient sélectionné" });
    }

    const ingredients = await Ingredient.find({ _id: { $in: ids } });

    // Supprimer les images Cloudinary
    for (const ingredient of ingredients) {
      if (ingredient.url) {
        try {
          const urlParts = ingredient.url.split("/");
          const filename = urlParts[urlParts.length - 1];
          const publicId = `ingredients/${filename.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error(
            "Erreur suppression image:",
            ingredient.name,
            cloudinaryError,
          );
        }
      }
    }

    await Ingredient.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      error: false,
      message: `${ingredients.length} ingrédient(s) supprimé(s) avec succès`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.ResetIngredientsUrl = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Aucun ingrédient sélectionné" });
    }

    const ingredients = await Ingredient.find({ _id: { $in: ids } });

    // Supprimer les anciennes images Cloudinary
    for (const ingredient of ingredients) {
      if (ingredient.url) {
        try {
          const urlParts = ingredient.url.split("/");
          const filename = urlParts[urlParts.length - 1];
          const publicId = `ingredients/${filename.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error(
            "Erreur suppression image:",
            ingredient.name,
            cloudinaryError,
          );
        }
      }
    }

    await Ingredient.updateMany({ _id: { $in: ids } }, { url: null });

    return res.status(200).json({
      error: false,
      message: `URL réinitialisée pour ${ingredients.length} ingrédient(s)`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};
