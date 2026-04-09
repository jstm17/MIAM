// utils/translate.js
const deepl = require("deepl-node");

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

const translateToEnglish = async (name) => {
  try {
    const result = await translator.translateText(name, "fr", "en-US");
    return result.text.toLowerCase();
  } catch (err) {
    console.error("Traduction DeepL failed:", err.message);
    return name;
  }
};

module.exports = { translateToEnglish };
