const { generateJwt } = require("../utils/jwtUtils");
const { hashPassword, verifyPassword } = require("../utils/passwordUtils");

const User = require("../models/User");
const Ingredient = require("../models/Ingredient");
const Recipe = require("../models/Recipe");
const { baseSlugify } = require("../utils/slugify");

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
      { new: true },
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

    if (!hasSavedRecipe) {
      user.savedRecipes.push({ recipe: recipeId, savedAt: new Date() });
    }

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
      path: "savedIngredients.recipe",
      populate: [
        { path: "ingredients.ingredient" },
        { path: "categories" },
        { path: "addedBy", select: "name" },
      ],
    });
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
      { new: true },
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

// Update name
exports.UpdateUserName = async (req, res) => {
  try {
    const { name } = req.body;

    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res
        .status(404)
        .json({ error: true, message: "Utilisateur non trouvé" });
    }

    if (currentUser.name === name) {
      return res.status(400).json({
        error: true,
        message: "Choisissez un nom différent de votre nom actuel",
      });
    }

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

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, slug },
      { new: true },
    );

    const returnedData = user.toObject();
    delete returnedData.password;

    return res.status(200).json({
      error: false,
      message: "Nom mis à jour avec succès",
      data: returnedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La mise à jour du nom a échoué",
    });
  }
};

// Delete User
exports.DeleteUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: true,
        message: "Utilisateur non trouvé",
      });
    }

    await User.findByIdAndDelete(req.user.id);

    return res.status(200).json({
      error: false,
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur Server - La suppression du compte a échoué",
    });
  }
};

// Clear Shopping List
exports.ClearShoppingList = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { savedIngredients: [] } },
      { new: true },
    );

    return res.status(200).json({
      error: false,
      message: "Liste de course vidée avec succès",
      data: user.savedIngredients,
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

module.exports = {
  Register: exports.Register,
  Login: exports.Login,
  GetMe: exports.GetMe,
  SaveRecipe: exports.SaveRecipe,
  UnsaveRecipe: exports.UnsaveRecipe,
  AddIngredientToCart: exports.AddIngredientToCart,
  RemoveIngredientFromCart: exports.RemoveIngredientFromCart,
  ClearShoppingList: exports.ClearShoppingList,
  UpdateUserName: exports.UpdateUserName,
  DeleteUser: exports.DeleteUser,
  GetAllUsers: exports.GetAllUsers,
  GetUserBySlug: exports.GetUserBySlug,
};
