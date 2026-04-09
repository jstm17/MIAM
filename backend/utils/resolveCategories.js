const Category = require("../models/Category");
const { translateCategoryCached } = require("./translateCategoryCached");

const resolveCategories = async (categories) => {
  const newCategoryIds = [];

  const resolved = await Promise.all(
    categories.map(async (categoryName) => {
      const isNew = !(await Category.findOne({ name: categoryName }));
      const found = await translateCategoryCached(categoryName);
      if (isNew) newCategoryIds.push(found._id);
      return found._id;
    }),
  );

  return { resolvedCategories: resolved, newCategoryIds };
};

module.exports = { resolveCategories };
