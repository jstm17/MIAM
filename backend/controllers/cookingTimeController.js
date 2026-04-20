require("dotenv").config();
const mongoose = require("mongoose");

const axios = require("axios");
const CookingTime = require("../models/CookingTime");
const Category = require("../models/Category");
const User = require("../models/User");
const { CleanUsersOrphanData } = require("../utils/cleanupUsers");
const { CleanUnusedCategories } = require("./categoryController");
const { cloudinary } = require("../config/cloudinary");
const { resolveCategories } = require("../utils/resolveCategories");
const { hydrateCategoryImages } = require("../utils/hydrateCategoryImage");
const { slugifyRecipe } = require("../utils/slugify");
const {
  fetchAndUploadCookingTimeImage,
} = require("../utils/fetchAndUploadCookingTimeImage");
const { compressAndUploadImage } = require("../utils/imageUpload");
const { deleteImageFromCloudinary } = require("../utils/cloudinaryUtils");

// Create cookingTime
exports.CreateCookingTime = async (req, res) => {
  try {
    const { name, device, degreeCook, timeCook, methodCook, notes, visible } =
      req.body;
    const categories = JSON.parse(req.body.categories);

    if (!name || !categories || !visible) {
      return res.status(400).json({
        error: true,
        message: "Tous les champs sont requis",
      });
    }

    const imageUrl = req.file
      ? await compressAndUploadImage(req.file.buffer, "cookingTimes")
      : await fetchAndUploadCookingTimeImage(name);

    const { resolvedCategories, newCategoryIds } =
      await resolveCategories(categories);

    const cookingTime = new CookingTime({
      name,
      device,
      degreeCook,
      timeCook,
      methodCook,
      notes,
      categories: resolvedCategories,
      addedBy: req.user.id,
      image: imageUrl,
      visible,
    });

    await cookingTime.save();

    cookingTime.slug = slugifyRecipe(cookingTime.name, cookingTime._id);
    await cookingTime.save();

    res.status(201).json({
      error: false,
      message: "Temps de cuisson créé avec succès",
      data: cookingTime,
    });

    // jobs en background
    hydrateCategoryImages(newCategoryIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La temps de cuisson n'a pas pu être créé",
    });
  }
};

// Get cookingTime by ID
exports.GetCookingTimeById = async (req, res) => {
  try {
    const cookingTime = await CookingTime.findById(req.params.id)
      .populate("categories")
      .populate("addedBy", "name _id");

    if (!cookingTime) {
      return res.status(404).json({
        error: true,
        message: "Temps de cuisson non trouvé",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Temps de cuisson trouvé avec succès",
      data: cookingTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La temps de cuisson n'a pas pu être récupéré",
    });
  }
};

exports.GetCookingTimeBySlug = async (req, res) => {
  try {
    const cookingTime = await CookingTime.findOne(req.params)
      .populate("categories")
      .populate("addedBy", "name _id");

    if (!cookingTime) {
      return res.status(404).json({
        error: true,
        message: "Temps de cuisson non trouvé",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Temps de cuisson trouvé avec succès",
      data: cookingTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La temps de cuisson n'a pas pu être récupéré",
    });
  }
};

exports.GetAllCookingTimesByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        error: true,
        message: "Catégorie non trouvé",
      });
    }

    const cookingTimes = await CookingTime.find({ categories: category._id })
      .populate("categories")
      .populate("addedBy", "name _id");

    return res.status(200).json({
      error: false,
      message: "Temps de cuissons trouvés avec succès",
      data: cookingTimes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message:
        "Erreur Server - Les temps de cuisson n'ont pas pu être récupérés",
    });
  }
};

exports.GetAllCookingTimesVisiblesByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        error: true,
        message: "Catégorie non trouvé",
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

    const cookingTimes = await CookingTime.find(filter)
      .populate("categories")
      .populate("addedBy", "name _id");

    return res.status(200).json({
      error: false,
      message: "Temps de cuissons trouvés avec succès",
      data: cookingTimes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message:
        "Erreur Server - Les temps de cuisson n'ont pas pu être récupérés",
    });
  }
};

// Get all cookingTimes
exports.GetAllCookingTimes = async (req, res) => {
  try {
    const cookingTimes = await CookingTime.find()
      .sort({ createdAt: -1 })
      .populate("categories")
      .populate("addedBy", "name _id");

    return res.status(200).json({
      error: false,
      message: "Temps de cuissons récupérés avec succès",
      data: cookingTimes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message:
        "Erreur Server - Les temps de cuisson n'ont pas pu être récupérés",
    });
  }
};

// Get all cookingTimes by me
exports.GetAllCookingTimesByMe = async (req, res) => {
  try {
    const cookingTimes = await CookingTime.find({ addedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate("categories")
      .populate("addedBy", "name _id");

    return res.status(200).json({
      error: false,
      message: "Temps de cuissons récupérés avec succès",
      data: cookingTimes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message:
        "Erreur Server - Les temps de cuisson n'ont pas pu être récupérés",
    });
  }
};

// Get visible cookingTimes from others and all cookingTimes from the authenticated user
exports.GetAllCookingTimesVisibles = async (req, res) => {
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

    const cookingTimes = await CookingTime.find(filter)
      .sort({ createdAt: -1 })
      .populate("categories")
      .populate("addedBy", "name _id");

    return res.status(200).json({
      error: false,
      message: "Temps de cuissons récupérés avec succès",
      data: cookingTimes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message:
        "Erreur Server - Les temps de cuisson n'ont pas pu être récupérés",
    });
  }
};

// Get all cookingTimes by user Id
exports.GetAllCookingTimesByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const cookingTimes = await CookingTime.find({ addedBy: id })
      .sort({ createdAt: -1 })
      .populate("categories")
      .populate("addedBy", "name _id");

    return res.status(200).json({
      error: false,
      message: "Temps de cuissons récupérés avec succès",
      data: cookingTimes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message:
        "Erreur Server - Les temps de cuisson n'ont pas pu être récupérés",
    });
  }
};

// Update cookingTime
exports.UpdateCookingTime = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, device, degreeCook, timeCook, methodCook, notes, visible } =
      req.body;
    const categories = JSON.parse(req.body.categories);

    const cookingTime = await CookingTime.findOne({ slug });

    if (!cookingTime) {
      return res
        .status(404)
        .json({ error: true, message: "Temps de cuisson non trouvé" });
    }

    if (cookingTime.addedBy.toString() !== req.user.id) {
      return res.status(403).json({
        error: true,
        message: "Vous n'êtes pas autorisé à modifier ce temps de cuisson",
      });
    }

    let imageUrl = cookingTime.image;
    if (req.file) {
      if (cookingTime.image) {
        await deleteImageFromCloudinary(cookingTime.image);
      }
      imageUrl = await compressAndUploadImage(req.file.buffer, "cookingTimes");
    } else if (!req.body.image) {
      const fetchedUrl = await fetchAndUploadCookingTimeImage(name);
      if (fetchedUrl) {
        if (cookingTime.image) {
          await deleteImageFromCloudinary(cookingTime.image);
        }
        imageUrl = fetchedUrl;
      }
    }

    const { resolvedCategories, newCategoryIds } =
      await resolveCategories(categories);

    const updateData = {
      name,
      device,
      degreeCook,
      timeCook,
      methodCook,
      notes,
      categories: resolvedCategories,
      image: imageUrl,
      visible,
    };

    if (name && name !== cookingTime.name) {
      updateData.slug = slugifyRecipe(name, cookingTime._id);
    }

    const updatedCookingTime = await CookingTime.findOneAndUpdate(
      { slug },
      updateData,
      {
        returnDocument: "after",
      },
    ).populate("categories");

    res.status(200).json({
      error: false,
      message: "Temps de cuisson mise à jour avec succès",
      data: updatedCookingTime,
    });

    hydrateCategoryImages(newCategoryIds);
    CleanUnusedCategories();
    CleanUsersOrphanData();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La mise à jour de la temps de cuisson a échoué",
    });
  }
};

// Delete cookingTime
exports.DeleteCookingTime = async (req, res) => {
  try {
    const { id } = req.params;

    const cookingTime = await CookingTime.findById(id);

    if (!cookingTime) {
      return res.status(404).json({
        error: true,
        message: "Temps de cuisson non trouvé",
      });
    }

    if (cookingTime.addedBy.toString() !== req.user.id) {
      return res.status(403).json({
        error: true,
        message: "Vous n'êtes pas autorisé à supprimer ce temps de cuisson",
      });
    }

    // Supprimer l'image Cloudinary si elle existe
    if (cookingTime.image) {
      await deleteImageFromCloudinary(cookingTime.image);
    }

    const cookingTimeObjectId = new mongoose.Types.ObjectId(req.params.id);
    await CookingTime.findByIdAndDelete(id);

    await User.updateMany(
      { "savedCookingTimes.cookingTime": cookingTimeObjectId },
      { $pull: { savedCookingTimes: { cookingTime: cookingTimeObjectId } } },
    );

    await CleanUnusedCategories();
    await CleanUsersOrphanData();
    return res.status(200).json({
      error: false,
      message: "Temps de cuisson supprimée avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La suppression de la temps de cuisson a échoué",
    });
  }
};

exports.ShowCookingTime = async (req, res) => {
  try {
    const cookingTime = await CookingTime.findByIdAndUpdate(
      req.params.id,
      { visible: true },
      { returnDocument: "after" },
    );
    if (!cookingTime)
      return res
        .status(404)
        .json({ error: true, message: "Temps de cuisson non trouvé" });
    return res.status(200).json({
      error: false,
      message: "Temps de cuisson visible",
      data: cookingTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.HideCookingTime = async (req, res) => {
  try {
    const cookingTime = await CookingTime.findByIdAndUpdate(
      req.params.id,
      { visible: false },
      { returnDocument: "after" },
    );
    if (!cookingTime)
      return res
        .status(404)
        .json({ error: true, message: "Temps de cuisson non trouvé" });
    return res.status(200).json({
      error: false,
      message: "Temps de cuisson privée",
      data: cookingTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};
