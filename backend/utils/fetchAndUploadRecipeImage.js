const axios = require("axios");
const { cloudinary } = require("../config/cloudinary");
const { translateToEnglish } = require("./translate");

const fetchAndUploadRecipeImage = async (name) => {
  try {
    const query = await translateToEnglish(name);
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: process.env.PIXABAY_API_KEY,
        q: `${query} food`,
        image_type: "photo",
        per_page: 3,
        safesearch: true,
      },
    });

    const pixabayUrl = response.data.hits[0]?.largeImageURL;
    if (!pixabayUrl) return null;

    const imageResponse = await axios.get(pixabayUrl, {
      responseType: "arraybuffer",
    });
    const base64 = Buffer.from(imageResponse.data).toString("base64");
    const mimeType = imageResponse.headers["content-type"];

    const cloudinaryRes = await cloudinary.uploader.upload(
      `data:${mimeType};base64,${base64}`,
      { folder: "recipes" },
    );
    return cloudinaryRes.secure_url;
  } catch (err) {
    console.error("Erreur image recette:", err.message);
    return null;
  }
};

module.exports = { fetchAndUploadRecipeImage };
