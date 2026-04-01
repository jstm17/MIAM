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
        message: "Un utilisateur existe déjà avec ce nom",
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
      message: "Utilisateur créé avec succès",
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
        message: "Le nom est incorrect",
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
    const user = await User.findById(req.user.id);

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
