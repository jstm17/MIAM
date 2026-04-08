const normalizeIngredientName = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD") // enlève accents
    .replace(/[\u0300-\u036f]/g, "") // enlève accents unicode
    .replace(/[^a-z0-9\s]/g, "") // enlève ponctuation
    .replace(/\s+/g, " ") // supprime double espaces
    .trim();
};

module.exports = { normalizeIngredientName };
