// utils/slugify.js

const baseSlugify = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD") // enlève accents
    .replace(/[\u0300-\u036f]/g, "") // enlève diacritiques
    .replace(/[^a-z0-9\s-]/g, "") // enlève caractères spéciaux sauf tirets
    .trim()
    .replace(/\s+/g, "-") // espaces -> tirets
    .replace(/-+/g, "-") // évite les ----
    .replace(/^-|-$/g, ""); // évite -au-debut / -a-la-fin
};

const slugifyRecipe = (name, id) => {
  const slugName = baseSlugify(name);
  const shortId = id.toString().slice(-4);

  return `${slugName}_${shortId}`;
};

module.exports = { baseSlugify, slugifyRecipe };
