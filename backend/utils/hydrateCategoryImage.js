const Category = require("../models/Category");
const {
  fetchAndUploadCategoryImage,
} = require("./fetchAndUploadCategoryImage");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const hydrateCategoryImages = async (categoryIds) => {
  console.log("JOB: récupération images catégories...");

  for (const id of categoryIds) {
    const category = await Category.findById(id);

    if (!category || category.image) continue;

    try {
      const imageUrl = await fetchAndUploadCategoryImage(category.name);

      await Category.findByIdAndUpdate(id, {
        image: imageUrl,
      });

      await sleep(1000); // rate limit pixabay
    } catch (err) {
      console.error("Erreur image catégorie:", category.name);
    }
  }

  console.log("JOB catégories terminé !");
};

module.exports = { hydrateCategoryImages };
