const User = require("../models/User");

exports.GetAllAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 });

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

exports.UpdateAdmins = async (req, res) => {
  try {
    const { admins } = req.body; // array of names

    // Set role to 'admin' for selected
    await User.updateMany({ name: { $in: admins } }, { role: "admin" });

    // Set role to 'user' for others
    await User.updateMany({ name: { $nin: admins } }, { role: "user" });

    return res.status(200).json({
      error: false,
      message: "Admins mis à jour avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Erreur serveur",
    });
  }
};
