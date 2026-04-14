const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const { cloudinary } = require("../config/cloudinary");

exports.GetAllCategories = async (req, res) => {
  try {
    const categorys = await Category.find().sort({ name: 1 });
    return res.status(200).json({
      error: false,
      message: "Catégories récupérées avec succès",
      data: categorys,
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
    const usedCategoryIds = await Recipe.distinct("categories");

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
