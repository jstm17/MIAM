const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

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

exports.CleanUnusedCategorys = async () => {
  try {
    const usedCategoryIds = await Recipe.distinct("categorys.category");
    await Category.deleteMany({ _id: { $nin: usedCategoryIds } });
  } catch (error) {
    console.error("Erreur nettoyage catégories:", error);
  }
};
