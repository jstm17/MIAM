const axios = require("axios");
const { cloudinary } = require("../config/cloudinary");
const { translateIngredientCached } = require("./translateFoodName");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAndUploadIngredientImage = async (name, retries = 3) => {
  try {
    const query = await translateIngredientCached(name);

    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: process.env.PIXABAY_API_KEY,
        q: `${query} food ingredient`,
        image_type: "photo",
        per_page: 3,
        safesearch: true,
      },
    });

    const pixabayUrl = response.data.hits[0]?.largeImageURL;
    if (!pixabayUrl) return null;

    const cloudinaryRes = await cloudinary.uploader.upload(pixabayUrl, {
      folder: "ingredients",
    });
    return cloudinaryRes.secure_url;
  } catch (error) {
    if (
      error?.http_code === 400 &&
      error?.message?.includes("429") &&
      retries > 0
    ) {
      console.log(
        `Rate limit atteint pour "${name}", retry dans 2s... (${retries} essais restants)`,
      );
      await sleep(2000);
      return fetchAndUploadIngredientImage(name, retries - 1);
    }

    console.error("Erreur image ingrédient:", error);
    return null;
  }
};

module.exports = { fetchAndUploadIngredientImage };
