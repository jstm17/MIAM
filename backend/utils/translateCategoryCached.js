// utils/translateCategoryName.js
const Category = require("../models/Category");
const { translateToEnglish } = require("./translate");
const { baseSlugify } = require("./slugify");

const translateCategoryCached = async (name) => {
  let category = await Category.findOne({ name });
  if (category?.englishName) {
    return category; // retourne le document complet
  }

  const translated = await translateToEnglish(name);
  category = await Category.findOneAndUpdate(
    { name },
    { name, englishName: translated, slug: baseSlugify(name) },
    { upsert: true, returnDocument: "after" },
  );
  return category;
};

module.exports = { translateCategoryCached };
