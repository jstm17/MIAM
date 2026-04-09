// const axios = require("axios");
// const { cloudinary } = require("../config/cloudinary");
// const { translateIngredientCached } = require("./translateIngredientCached");

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const fetchAndUploadIngredientImage = async (name, retries = 3) => {
//   try {
//     const ingredient = await translateIngredientCached(name);
//     const query = ingredient.englishName || name;

//     await sleep(1000);

//     const response = await axios.get("https://pixabay.com/api/", {
//       params: {
//         key: process.env.PIXABAY_API_KEY,
//         q: `${query} food ingredient`,
//         image_type: "photo",
//         per_page: 3,
//         safesearch: true,
//       },
//     });

//     const pixabayUrl = response.data.hits[0]?.largeImageURL;
//     if (!pixabayUrl) return null;

//     const imageResponse = await axios.get(pixabayUrl, {
//       responseType: "arraybuffer",
//     });

//     const base64 = Buffer.from(imageResponse.data).toString("base64");
//     const mimeType = imageResponse.headers["content-type"];

//     // Upload en base64
//     const cloudinaryRes = await cloudinary.uploader.upload(
//       `data:${mimeType};base64,${base64}`,
//       { folder: "ingredients" },
//     );

//     return cloudinaryRes.secure_url;
//   } catch (error) {
//     if (
//       error?.http_code === 400 &&
//       error?.message?.includes("429") &&
//       retries > 0
//     ) {
//       console.log(
//         `Rate limit atteint pour "${name}", retry dans 2s... (${retries} essais restants)`,
//       );
//       await sleep(5000);
//       return fetchAndUploadIngredientImage(name, retries - 1);
//     }

//     console.error("Erreur image ingrédient:", error);
//     return null;
//   }
// };

// module.exports = { fetchAndUploadIngredientImage };

const axios = require("axios");
const { cloudinary } = require("../config/cloudinary");
const { translateIngredientCached } = require("./translateIngredientCached");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAndUploadIngredientImage = async (name, retries = 3) => {
  try {
    const ingredient = await translateIngredientCached(name);
    const query = ingredient.englishName || name;

    await sleep(500);

    // Recherche sur Spoonacular
    const searchResponse = await axios.get(
      "https://api.spoonacular.com/food/ingredients/search",
      {
        params: {
          query,
          number: 1,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      },
    );

    const imageFile = searchResponse.data.results[0]?.image;
    if (!imageFile) return null;

    const imageUrl = `https://spoonacular.com/cdn/ingredients_500x500/${imageFile}`;

    // Upload vers Cloudinary en base64
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const base64 = Buffer.from(imageResponse.data).toString("base64");
    const mimeType = imageResponse.headers["content-type"];

    const cloudinaryRes = await cloudinary.uploader.upload(
      `data:${mimeType};base64,${base64}`,
      { folder: "ingredients" },
    );

    return cloudinaryRes.secure_url;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retry pour "${name}" dans 3s... (${retries} restants)`);
      await sleep(3000);
      return fetchAndUploadIngredientImage(name, retries - 1);
    }
    console.error("Erreur image ingrédient:", name, error.message);
    return null;
  }
};

module.exports = { fetchAndUploadIngredientImage };
