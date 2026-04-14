const { generateJwt } = require("../utils/jwtUtils");
const { hashPassword, verifyPassword } = require("../utils/passwordUtils");

const User = require("../models/User");
const Ingredient = require("../models/Ingredient");
const Recipe = require("../models/Recipe");
const Category = require("../models/Category");
const { baseSlugify } = require("../utils/slugify");
const cloudinary = require("cloudinary").v2;
const { CleanUsersOrphanData } = require("../utils/cleanupUsers");
const { compressAndUploadImage } = require("../utils/imageUpload");
const { deleteImageFromCloudinary } = require("../utils/cloudinaryUtils");

const sanitizeSavedLists = (user) => {
  if (!Array.isArray(user.savedRecipes)) {
    user.savedRecipes = [];
  }
  if (!Array.isArray(user.savedIngredients)) {
    user.savedIngredients = [];
  }
  if (!Array.isArray(user.savedProducts)) {
    user.savedProducts = [];
  }

  user.savedRecipes = user.savedRecipes.filter(
    (savedRecipe) => savedRecipe && savedRecipe.recipe,
  );
  user.savedIngredients = user.savedIngredients.filter(
    (savedIngredient) =>
      savedIngredient && savedIngredient.ingredient && savedIngredient.recipe,
  );
};

// Register
exports.Register = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        error: true,
        message: "Requête invalide",
      });
    }

    const slug = baseSlugify(name);

    const isExist = await User.findOne({ $or: [{ name }, { slug }] });

    if (isExist) {
      return res.status(409).json({
        error: true,
        message: "Ce nom est déjà pris",
      });
    }

    const hashedPassword = await hashPassword(password);

    const data = {
      name,
      slug,
      password: hashedPassword,
    };

    const createdUser = new User(data);
    await createdUser.save();

    const { password: _pwd, ...returnedData } = data;

    return res.status(201).json({
      error: false,
      message: "Compte créé avec succès",
      data: returnedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - L'inscription a échoué",
    });
  }
};

// Login
exports.Login = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Ce nom d'utilisateur n'existe pas",
      });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        message: "Le mot de passe est incorrect",
      });
    }

    const jwtToken = await generateJwt({ id: user._id, name: user.name });

    return res.status(200).json({
      error: false,
      message: "Connexion réussie",
      data: {
        token: jwtToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La connexion a échoué",
    });
  }
};

// Get Me
exports.GetMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "savedRecipes.recipe",
        populate: [
          { path: "ingredients.ingredient" },
          { path: "categories" },
          { path: "addedBy" },
        ],
      })
      .populate({ path: "savedIngredients.ingredient" })
      .populate({
        path: "savedIngredients.recipe",
        populate: [
          { path: "ingredients.ingredient" },
          { path: "categories" },
          { path: "addedBy" },
        ],
      });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Utilisateur non trouvé",
      });
    }

    const returnedData = user.toObject();
    delete returnedData.password;

    return res.status(200).json({
      error: false,
      message: "Utilisateur trouvé avec succès",
      data: returnedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - L'utilisateur n'a pas pu être récupéré",
    });
  }
};

// Save Recipe
exports.SaveRecipe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          savedRecipes: { recipe: req.params.recipeId, savedAt: new Date() },
        },
      },
      { returnDocument: "after" },
    ).populate({
      path: "savedRecipes.recipe",
      populate: [
        { path: "categories" },
        { path: "ingredients.ingredient" },
        { path: "addedBy", select: "name" },
      ],
    });

    return res.status(200).json({
      error: false,
      message: "Recette sauvegardée",
      data: user.savedRecipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La recette n'a pas pu être sauvegardée",
    });
  }
};

exports.AddIngredientToCart = async (req, res) => {
  try {
    const { ingredientId } = req.body;
    const recipeId = req.params.recipeId;

    if (!ingredientId) {
      return res.status(400).json({
        error: true,
        message: "L'identifiant de l'ingrédient est requis",
      });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        error: true,
        message: "Recette non trouvée",
      });
    }

    const ingredient = await Ingredient.findById(ingredientId);
    if (!ingredient) {
      return res.status(404).json({
        error: true,
        message: "Ingrédient non trouvé",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Utilisateur non trouvé",
      });
    }

    if (!Array.isArray(user.savedRecipes)) {
      user.savedRecipes = [];
    }
    if (!Array.isArray(user.savedIngredients)) {
      user.savedIngredients = [];
    }

    user.savedRecipes = user.savedRecipes.filter(
      (savedRecipe) => savedRecipe && savedRecipe.recipe,
    );
    user.savedIngredients = user.savedIngredients.filter(
      (savedIngredient) =>
        savedIngredient && savedIngredient.ingredient && savedIngredient.recipe,
    );

    const hasSavedRecipe = user.savedRecipes.some(
      (savedRecipe) => savedRecipe?.recipe?.toString?.() === recipeId,
    );
    const hasSavedIngredient = user.savedIngredients.some((savedIngredient) => {
      const ingredientValue = savedIngredient?.ingredient;
      const recipeValue = savedIngredient?.recipe;
      return (
        ingredientValue &&
        recipeValue &&
        ingredientValue.toString?.() === ingredientId &&
        recipeValue.toString?.() === recipeId
      );
    });

    if (!hasSavedIngredient) {
      user.savedIngredients.push({
        ingredient: ingredientId,
        recipe: recipeId,
        addedAt: new Date(),
      });
    }

    await user.save();
    await user.populate({ path: "savedIngredients.ingredient" });

    await user.populate({
      path: "savedRecipes.recipe",
      populate: [
        { path: "ingredients.ingredient" },
        { path: "categories" },
        { path: "addedBy", select: "name" },
      ],
    });

    return res.status(200).json({
      error: false,
      message: "Ingrédient ajouté au panier",
      data: {
        savedIngredients: user.savedIngredients,
        savedRecipes: user.savedRecipes,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - Impossible d'ajouter l'ingrédient au panier",
    });
  }
};

exports.RemoveIngredientFromCart = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const ingredientId = req.params.ingredientId;

    if (!ingredientId) {
      return res.status(400).json({
        error: true,
        message: "L'identifiant de l'ingrédient est requis",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Utilisateur non trouvé",
      });
    }

    if (!Array.isArray(user.savedIngredients)) {
      user.savedIngredients = [];
    }

    user.savedIngredients = user.savedIngredients.filter(
      (savedIngredient) =>
        !(
          savedIngredient.ingredient.toString() === ingredientId &&
          savedIngredient.recipe.toString() === recipeId
        ),
    );

    sanitizeSavedLists(user);
    await user.save();
    await user.populate({ path: "savedIngredients.ingredient" });
    await user.populate({
      path: "savedIngredients.recipe",
      populate: [
        { path: "ingredients.ingredient" },
        { path: "categories" },
        { path: "addedBy", select: "name" },
      ],
    });

    return res.status(200).json({
      error: false,
      message: "Ingrédient retiré du panier",
      data: {
        savedIngredients: user.savedIngredients,
        savedRecipes: user.savedRecipes,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - Impossible de retirer l'ingrédient du panier",
    });
  }
};

// Unsave Recipe
exports.UnsaveRecipe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedRecipes: { recipe: req.params.recipeId } } },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      error: false,
      message: "Recette retirée des favoris",
      data: user.savedRecipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La recette n'a pas pu être retirée",
    });
  }
};

// Update User Profile
exports.UpdateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res
        .status(404)
        .json({ error: true, message: "Utilisateur non trouvé" });
    }

    const updateData = {};

    // Mise à jour du nom uniquement si fourni et différent
    if (name && name.toLowerCase() !== currentUser.name.toLowerCase()) {
      const slug = baseSlugify(name);

      const isExist = await User.findOne({
        $or: [{ name }, { slug }],
        _id: { $ne: req.user.id },
      });

      if (isExist) {
        return res
          .status(409)
          .json({ error: true, message: "Ce nom est déjà pris" });
      }

      updateData.name = name;
      updateData.slug = slug;
    }

    if (req.body.removeAvatar === "true" && currentUser.avatar) {
      await deleteImageFromCloudinary(currentUser.avatar);
      updateData.avatar = null;
    }

    if (req.file) {
      if (currentUser.avatar) {
        await deleteImageFromCloudinary(currentUser.avatar);
      }
      updateData.avatar = await compressAndUploadImage(req.file.buffer, "avatars");
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      returnDocument: "after",
    });

    const returnedData = user.toObject();
    delete returnedData.password;

    return res.status(200).json({
      error: false,
      message: "Profil mis à jour avec succès",
      data: returnedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.DeleteUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: true,
        message: "Utilisateur non trouvé",
      });
    }

    const userId = req.user.id;

    // 1️⃣ récupérer les recettes du user
    const userRecipes = await Recipe.find({ addedBy: userId })
      .select("_id ingredients categories")
      .lean();

    const recipeIds = userRecipes.map((r) => r._id);

    console.log("Recettes trouvées:", recipeIds.length);

    if (recipeIds.length === 0) {
      await User.findByIdAndDelete(userId);
      return res.json({
        error: false,
        message: "Compte supprimé avec succès",
      });
    }

    // 2️⃣ récupérer IDs uniques ingrédients + catégories
    const ingredientIds = [
      ...new Set(
        userRecipes.flatMap((r) => r.ingredients.map((i) => i.ingredient)),
      ),
    ];

    const categoryIds = [...new Set(userRecipes.flatMap((r) => r.categories))];

    console.log("Ingredients collectés:", ingredientIds.length);
    console.log("Categories collectées:", categoryIds.length);

    // 3️⃣ supprimer les recettes du user
    const deletedRecipes = await Recipe.deleteMany({ addedBy: userId });
    console.log("Recettes supprimées:", deletedRecipes.deletedCount);

    // 4️⃣ ingrédients encore utilisés ailleurs
    const stillUsedIngredients = await Recipe.distinct(
      "ingredients.ingredient",
    );
    // 5️⃣ catégories encore utilisées ailleurs
    const stillUsedCategories = await Recipe.distinct("categories");

    const orphanIngredients = ingredientIds.filter(
      (id) => !stillUsedIngredients.some((used) => used.equals(id)),
    );

    const orphanCategories = categoryIds.filter(
      (id) => !stillUsedCategories.some((used) => used.equals(id)),
    );

    // 6️⃣ supprimer orphelins
    await Ingredient.deleteMany({ _id: { $in: orphanIngredients } });
    await Category.deleteMany({ _id: { $in: orphanCategories } });

    // console.log("Ingredients supprimés:", deletedIngredients.deletedCount);
    // console.log("Categories supprimées:", deletedCategories.deletedCount);

    // 7️⃣ supprimer user
    await User.findByIdAndDelete(userId);
    await CleanUsersOrphanData();

    res.status(200).json({
      error: false,
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur - suppression échouée",
    });
  }
};

// Clear Shopping List
exports.ClearShoppingList = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { savedIngredients: [], savedProducts: [] } },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      error: false,
      message: "Liste de course vidée avec succès",
      data: {
        savedIngredients: user.savedIngredients,
        savedProducts: user.savedProducts,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - Impossible de vider la liste de course",
    });
  }
};

// Get all users
exports.GetAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ name: 1 });

    return res.status(200).json({
      error: false,
      message: "Utilisateurs récupérés avec succès",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

exports.GetAllUsersVisibles = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "recipes",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$addedBy", "$$userId"] },
                    { $eq: ["$visible", true] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "recipesCountData",
        },
      },
      {
        $addFields: {
          recipesCount: {
            $ifNull: [{ $arrayElemAt: ["$recipesCountData.count", 0] }, 0],
          },
        },
      },
      { $project: { password: 0, recipesCountData: 0 } },
      { $sort: { name: 1 } },
    ]);

    return res.status(200).json({
      error: false,
      message: "Utilisateurs récupérés avec succès",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

// Get top users by visible recipe count
exports.GetTopAllUsers = async (req, res) => {
  try {
    const topUsers = await Recipe.aggregate([
      { $match: { visible: true, addedBy: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$addedBy",
          recipesCount: { $sum: 1 },
        },
      },
      { $sort: { recipesCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$user", { recipesCount: "$recipesCount" }],
          },
        },
      },
      { $project: { password: 0 } },
    ]);

    return res.status(200).json({
      error: false,
      message: "Top utilisateurs récupérés avec succès",
      data: topUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

// Get user by slug
exports.GetUserBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const user = await User.findOne({ slug })
      .select("-password")
      .populate({
        path: "savedRecipes.recipe",
        populate: [
          { path: "categories" },
          { path: "ingredients.ingredient" },
          { path: "addedBy", select: "name slug" },
        ],
      });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Utilisateur non trouvé",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Utilisateur récupéré avec succès",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};

exports.AddProductToCart = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ error: true, message: "Utilisateur non trouvé" });

    const alreadyAdded = user.savedProducts.some(
      (p) => p.name.toLowerCase() === name.toLowerCase(),
    );

    if (alreadyAdded) {
      return res
        .status(400)
        .json({ error: true, message: "Le produit déjà dans la liste" });
    }

    sanitizeSavedLists(user);
    user.savedProducts.push({ name, addedAt: new Date() });
    await user.save();

    return res.status(200).json({
      error: false,
      message: "Produit ajouté",
      data: user.savedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.RemoveProductFromCart = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ error: true, message: "Utilisateur non trouvé" });

    user.savedProducts = user.savedProducts.filter(
      (p) => p.name.toLowerCase() !== name.toLowerCase(),
    );

    sanitizeSavedLists(user);
    await user.save();

    return res.status(200).json({
      error: false,
      message: "Produit retiré du panier",
      data: user.savedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

exports.UpdateProductInCart = async (req, res) => {
  try {
    const { name, newName, checked } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ error: true, message: "Nom du produit requis" });
    }

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ error: true, message: "Utilisateur non trouvé" });

    const product = user.savedProducts.find(
      (p) => p.name.toLowerCase() === name.toLowerCase(),
    );

    if (!product) {
      return res
        .status(404)
        .json({ error: true, message: "Produit introuvable" });
    }

    if (newName && newName.trim().length > 0) {
      const alreadyAdded = user.savedProducts.some(
        (p) =>
          p.name.toLowerCase() === newName.toLowerCase() &&
          p._id.toString() !== product._id.toString(),
      );

      if (alreadyAdded) {
        return res
          .status(400)
          .json({ error: true, message: "Un produit du même nom existe déjà" });
      }

      product.name = newName.trim();
    }

    if (typeof checked === "boolean") {
      product.checked = checked;
    }

    sanitizeSavedLists(user);
    await user.save();

    return res.status(200).json({
      error: false,
      message: "Produit mis à jour",
      data: user.savedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Erreur serveur" });
  }
};

module.exports = {
  Register: exports.Register,
  Login: exports.Login,
  GetMe: exports.GetMe,
  SaveRecipe: exports.SaveRecipe,
  UnsaveRecipe: exports.UnsaveRecipe,
  AddIngredientToCart: exports.AddIngredientToCart,
  RemoveIngredientFromCart: exports.RemoveIngredientFromCart,
  ClearShoppingList: exports.ClearShoppingList,
  UpdateUserProfile: exports.UpdateUserProfile,
  DeleteUser: exports.DeleteUser,
  GetAllUsers: exports.GetAllUsers,
  GetAllUsersVisibles: exports.GetAllUsersVisibles,
  GetTopAllUsers: exports.GetTopAllUsers,
  GetUserBySlug: exports.GetUserBySlug,
  AddProductToCart: exports.AddProductToCart,
  UpdateProductInCart: exports.UpdateProductInCart,
  RemoveProductFromCart: exports.RemoveProductFromCart,
};
