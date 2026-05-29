const Ingredient = require("../models/Ingredient");
const Recipe = require("../models/Recipe");
const { cloudinary } = require("../config/cloudinary");
const { translateToEnglish } = require("../utils/translate");

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

    // Fetch et upload une nouvelle image
    const {
      fetchAndUploadIngredientImage,
    } = require("../utils/fetchAndUploadIngredientImage");
    const newUrl = await fetchAndUploadIngredientImage(ingredient.name);

    // Mettre à jour l'ingrédient avec la nouvelle URL
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { url: newUrl },
      { new: true },
    );

    return res.status(200).json({
      error: false,
      message: "URL réinitialisée avec succès",
      data: updatedIngredient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.UpdateIngredientName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: true, message: "Nom requis" });
    }

    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res
        .status(404)
        .json({ error: true, message: "Ingrédient non trouvé" });
    }

    const normalizedName = String(name).trim().toLowerCase();
    const capitalizedName =
      normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);
    const englishName = await translateToEnglish(capitalizedName);

    const nameQuery = {
      name: new RegExp(
        `^${String(capitalizedName).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      ),
    };

    // Vérifier si un ingrédient avec ce nom existe déjà (cas-insensible)
    const existingIngredient = await Ingredient.findOne(nameQuery);
    if (
      existingIngredient &&
      existingIngredient._id.toString() !== ingredient._id.toString()
    ) {
      return res.status(400).json({
        error: true,
        message: "Un ingrédient avec ce nom existe déjà",
      });
    }

    // Mettre à jour le nom, le normalizedName et l'englishName
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { name: capitalizedName, normalizedName, englishName },
      { new: true },
    );

    return res.status(200).json({
      error: false,
      message: "Nom mis à jour avec succès",
      data: updatedIngredient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: error.message || "Erreur serveur",
    });
  }
};

exports.UpdateIngredientUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: true, message: "URL requise" });
    }

    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res
        .status(404)
        .json({ error: true, message: "Ingrédient non trouvé" });
    }

    // Supprimer l'ancienne image Cloudinary si elle existe
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

    // Télécharger la nouvelle image
    const axios = require("axios");
    const imageResponse = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 10000,
    });

    const base64 = Buffer.from(imageResponse.data).toString("base64");
    const mimeType = imageResponse.headers["content-type"] || "image/jpeg";

    // Upload en Cloudinary
    const cloudinaryRes = await cloudinary.uploader.upload(
      `data:${mimeType};base64,${base64}`,
      { folder: "ingredients" },
    );

    // Mettre à jour l'ingrédient
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { url: cloudinaryRes.secure_url },
      { new: true },
    );

    return res.status(200).json({
      error: false,
      message: "URL mise à jour avec succès",
      data: updatedIngredient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: error.message || "Erreur serveur",
    });
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

    // Fetch et upload de nouvelles images
    const {
      fetchAndUploadIngredientImage,
    } = require("../utils/fetchAndUploadIngredientImage");

    const updatedIngredients = [];
    for (const ingredient of ingredients) {
      const newUrl = await fetchAndUploadIngredientImage(ingredient.name);
      const updated = await Ingredient.findByIdAndUpdate(
        ingredient._id,
        { url: newUrl },
        { new: true },
      );
      updatedIngredients.push(updated);
    }

    return res.status(200).json({
      error: false,
      message: `URL réinitialisée pour ${updatedIngredients.length} ingrédient(s)`,
      data: updatedIngredients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};
