const axios = require("axios");
const { cloudinary } = require("../config/cloudinary");
const { translateToEnglish } = require("./translate");
const sharp = require("sharp");

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
    const compressedBuffer = await sharp(imageResponse.data)
      .resize({ width: 1024, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "recipes", format: "webp" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return resolve(null);
          }
          resolve(result.secure_url);
        },
      );
      uploadStream.end(compressedBuffer);
    });
  } catch (err) {
    console.error("Erreur image recette:", err.message);
    return null;
  }
};

module.exports = { fetchAndUploadRecipeImage };
