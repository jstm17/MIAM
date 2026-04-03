const { generateJwt } = require("../utils/jwtUtils");
const { hashPassword, verifyPassword } = require("../utils/passwordUtils");

const User = require("../models/User");

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

    const isExist = await User.findOne({ name });

    if (isExist) {
      return res.status(409).json({
        error: true,
        message: "Ce nom est déjà pris",
      });
    }

    const hashedPassword = await hashPassword(password);

    const data = {
      name,
      password: hashedPassword,
    };

    const createdUser = new User(data);
    await createdUser.save();

    const returnedData = { ...data };
    delete returnedData.password;

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
    const user = await User.findById(req.user.id).populate({
      path: "savedRecipes",
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
      { $addToSet: { savedRecipes: req.params.recipeId } },
      { new: true },
    ).populate({
      path: "savedRecipes",
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

// Unsave Recipe
exports.UnsaveRecipe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedRecipes: req.params.recipeId } },
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

    const isExist = await User.findOne({ name, _id: { $ne: req.user.id } });

    if (isExist) {
      return res
        .status(409)
        .json({ error: true, message: "Ce nom est déjà pris" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
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
