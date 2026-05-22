const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const { cloudinary } = require("../config/cloudinary");
const CookingTime = require("../models/CookingTime");

exports.GetAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const recipesCount = await Recipe.countDocuments({
          categories: category._id,
        });
        const cookingTimesCount = await CookingTime.countDocuments({
          categories: category._id,
        });
        return { ...category.toObject(), recipesCount, cookingTimesCount };
      }),
    );
    return res.status(200).json({
      error: false,
      message: "Catégories récupérées avec succès",
      data: categoriesWithCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

exports.GetAllCategoriesVisibles = async (req, res) => {
  try {
    const userId = req.user?.id;
    const filter = userId
      ? {
          $or: [{ visible: true }, { addedBy: userId }],
        }
      : { visible: true };

    const categories = await Recipe.aggregate([
      { $match: filter },
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          recipesCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$category", { recipesCount: "$recipesCount" }],
          },
        },
      },
    ]);

    return res.status(200).json({
      error: false,
      message: "Catégories récupérées avec succès",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

exports.GetAllCategoriesVisiblesCookingTimes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const filter = userId
      ? {
          $or: [{ visible: true }, { addedBy: userId }],
        }
      : { visible: true };

    const categories = await CookingTime.aggregate([
      { $match: filter },
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          cookingTimesCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$category",
              { cookingTimesCount: "$cookingTimesCount" },
            ],
          },
        },
      },
    ]);

    return res.status(200).json({
      error: false,
      message: "Catégories récupérées avec succès",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

exports.GetTopCategoriesVisibles = async (req, res) => {
  try {
    const userId = req.user?.id;
    const filter = userId
      ? {
          $or: [{ visible: true }, { addedBy: userId }],
        }
      : { visible: true };

    const categories = await Recipe.aggregate([
      { $match: filter },
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          recipesCount: { $sum: 1 },
        },
      },
      { $sort: { recipesCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$category", { recipesCount: "$recipesCount" }],
          },
        },
      },
    ]);

    return res.status(200).json({
      error: false,
      message: "Catégories récupérées avec succès",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

exports.GetTopCategoriesVisiblesCookingTimes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const filter = userId
      ? {
          $or: [{ visible: true }, { addedBy: userId }],
        }
      : { visible: true };

    const categories = await CookingTime.aggregate([
      { $match: filter },
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          cookingTimesCount: { $sum: 1 },
        },
      },
      { $sort: { cookingTimesCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$category",
              { cookingTimesCount: "$cookingTimesCount" },
            ],
          },
        },
      },
    ]);

    return res.status(200).json({
      error: false,
      message: "Catégories récupérées avec succès",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

exports.CreateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    let category = await Category.findOne({ name });
    if (category) {
      return res.status(200).json({ error: false, data: category });
    }

    category = await Category.create({ name });
    return res.status(201).json({ error: false, data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.CleanUnusedCategories = async () => {
  try {
    const recipeCategoryIds = await Recipe.distinct("categories");
    const cookingTimeCategoryIds = await CookingTime.distinct("categories");
    const usedCategoryIds = Array.from(
      new Set([...recipeCategoryIds, ...cookingTimeCategoryIds]),
    );

    // Récupérer les catégories qui vont être supprimées
    const categoriesToDelete = await Category.find({
      _id: { $nin: usedCategoryIds },
      image: { $exists: true, $ne: null },
    });

    // Supprimer les images Cloudinary
    for (const category of categoriesToDelete) {
      if (category.image) {
        try {
          // Extraire le public_id de l'URL Cloudinary
          const urlParts = category.image.split("/");
          const filename = urlParts[urlParts.length - 1];
          const publicId = `categories/${filename.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error(
            "Erreur suppression image catégorie:",
            category.name,
            cloudinaryError,
          );
        }
      }
    }

    await Category.deleteMany({ _id: { $nin: usedCategoryIds } });
  } catch (error) {
    console.error("Erreur nettoyage catégories:", error);
  }
};

exports.GetCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        error: true,
        message: "Catégorie non trouvée",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Catégorie récupérée avec succès",
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

exports.DeleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ error: true, message: "Catégorie non trouvée" });
    }

    // Supprimer l'image Cloudinary si elle existe
    if (category.url) {
      try {
        const urlParts = category.url.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `categories/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Erreur suppression image:", cloudinaryError);
      }
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      error: false,
      message: "Catégorie supprimée avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.ResetCategoryUrl = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ error: true, message: "Catégorie non trouvée" });
    }

    // Supprimer l'ancienne image Cloudinary
    if (category.image) {
      try {
        const urlParts = category.image.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `categories/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Erreur suppression image:", cloudinaryError);
      }
    }

    // Fetch et upload une nouvelle image
    const {
      fetchAndUploadCategoryImage,
    } = require("../utils/fetchAndUploadCategoryImage");
    const newUrl = await fetchAndUploadCategoryImage(category.name);

    // Mettre à jour l'catégorie avec la nouvelle URL
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { image: newUrl },
      { new: true },
    );

    return res.status(200).json({
      error: false,
      message: "URL réinitialisée avec succès",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.UpdateCategoryName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: true, message: "Nom requis" });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ error: true, message: "Catégorie non trouvée" });
    }

    const normalizedName = String(name).trim();
    const capitalizedName =
      normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);

    const nameQuery = {
      name: new RegExp(
        `^${String(capitalizedName).replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`,
        "i",
      ),
    };

    const existingCategory = await Category.findOne(nameQuery);
    if (
      existingCategory &&
      existingCategory._id.toString() !== category._id.toString()
    ) {
      return res.status(400).json({
        error: true,
        message: "Une catégorie avec ce nom existe déjà",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name: capitalizedName },
      { new: true },
    );

    return res.status(200).json({
      error: false,
      message: "Nom mis à jour avec succès",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: error.message || "Erreur serveur",
    });
  }
};

exports.UpdateCategoryUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: true, message: "URL requise" });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ error: true, message: "Catégorie non trouvée" });
    }

    // Supprimer l'ancienne image Cloudinary si elle existe
    if (category.image) {
      try {
        const urlParts = category.image.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `categories/${filename.split(".")[0]}`;
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
      { folder: "categories" },
    );

    // Mettre à jour de la catégorie
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { image: cloudinaryRes.secure_url },
      { new: true },
    );

    return res.status(200).json({
      error: false,
      message: "URL mise à jour avec succès",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: error.message || "Erreur serveur",
    });
  }
};

exports.DeleteCategories = async (req, res) => {
  try {
    const { ids } = req.body; // tableau d'ids

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Aucun catégorie sélectionnée" });
    }

    const categories = await Category.find({ _id: { $in: ids } });

    // Supprimer les images Cloudinary
    for (const category of categories) {
      if (category.url) {
        try {
          const urlParts = category.url.split("/");
          const filename = urlParts[urlParts.length - 1];
          const publicId = `categories/${filename.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error(
            "Erreur suppression image:",
            category.name,
            cloudinaryError,
          );
        }
      }
    }

    await Category.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      error: false,
      message: `${categories.length} catégorie(s) supprimée(s) avec succès`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.ResetCategoriesUrl = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Aucun catégorie sélectionné" });
    }

    const categories = await Category.find({ _id: { $in: ids } });

    // Supprimer les anciennes images Cloudinary
    for (const category of categories) {
      if (category.image) {
        try {
          const urlParts = category.image.split("/");
          const filename = urlParts[urlParts.length - 1];
          const publicId = `categories/${filename.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error(
            "Erreur suppression image:",
            category.name,
            cloudinaryError,
          );
        }
      }
    }

    // Fetch et upload de nouvelles images
    const {
      fetchAndUploadCategoryImage,
    } = require("../utils/fetchAndUploadCategoryImage");

    const updatedCategories = [];
    for (const category of categories) {
      const newUrl = await fetchAndUploadCategoryImage(category.name);
      const updated = await Category.findByIdAndUpdate(
        category._id,
        { image: newUrl },
        { new: true },
      );
      updatedCategories.push(updated);
    }

    return res.status(200).json({
      error: false,
      message: `URL réinitialisée pour ${updatedCategories.length} catégorie(s)`,
      data: updatedCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};
