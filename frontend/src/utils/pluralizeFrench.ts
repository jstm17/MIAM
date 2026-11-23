/**
 * Ensemble d'ingrédients invariables ou indénombrables en cuisine française
 * qui ne prennent généralement pas la marque du pluriel dans une recette.
 */
const UNCOUNTABLE_INGREDIENTS = new Set([
  "sel",
  "poivre",
  "sucre",
  "sucre en poudre",
  "sucre glace",
  "sucre roux",
  "sucre vanille",
  "sucre vanillé",
  "farine",
  "farine de ble",
  "farine de blé",
  "farine complete",
  "farine complète",
  "farine de sarrasin",
  "farine de seigle",
  "farine de riz",
  "beurre",
  "beurre doux",
  "beurre demi-sel",
  "beurre sale",
  "beurre salé",
  "beurre mou",
  "beurre fondu",
  "huile",
  "huile d'olive",
  "huile de tournesol",
  "huile de colza",
  "huile de sesame",
  "huile de sésame",
  "huile de coco",
  "huile de friture",
  "vinaigre",
  "vinaigre blanc",
  "vinaigre de cidre",
  "vinaigre balsamique",
  "vinaigre de vin",
  "moutarde",
  "moutarde de dijon",
  "moutarde à l'ancienne",
  "miel",
  "lait",
  "lait demi-ecreme",
  "lait demi-écrémé",
  "lait ecreme",
  "lait écrémé",
  "lait entier",
  "lait de coco",
  "lait d'amande",
  "lait d'avoine",
  "lait de soja",
  "eau",
  "eau tiede",
  "eau tiède",
  "eau gazeuse",
  "levure",
  "levure chimique",
  "levure boulangere",
  "levure boulangère",
  "levure fraiche",
  "levure fraîche",
  "levure de boulanger",
  "cacao",
  "cacao en poudre",
  "cafe",
  "café",
  "the",
  "thé",
  "chocolat",
  "chocolat noir",
  "chocolat au lait",
  "chocolat blanc",
  "sauce soja",
  "sauce tomate",
  "coulis de tomate",
  "concentre de tomates",
  "concentré de tomates",
  "maizena",
  "maïzena",
  "fecule",
  "fécule",
  "fecule de mais",
  "fécule de maïs",
  "fecule de pomme de terre",
  "fécule de pomme de terre",
  "creme",
  "crème",
  "creme fraiche",
  "crème fraîche",
  "creme liquide",
  "crème liquide",
  "creme fleurette",
  "crème fleurette",
  "creme epaisse",
  "crème épaisse",
  "creme entiere",
  "crème entière",
  "creme de coco",
  "crème de coco",
  "mascarpone",
  "ricotta",
  "parmesan",
  "parmesan rape",
  "parmesan râpé",
  "gruyere",
  "gruyère",
  "gruyere rape",
  "gruyère râpé",
  "emmental",
  "emmental rape",
  "emmental râpé",
  "mozzarella",
  "cheddar",
  "roquefort",
  "feta",
  "comte",
  "comté",
  "pesto",
  "mayonnaise",
  "ketchup",
  "semoule",
  "polenta",
  "viande hachee",
  "viande hachée",
  "chair à saucisse",
]);

/**
 * Exceptions courantes de pluriel pour les mots culinaires
 */
const IRREGULAR_PLURALS: Record<string, string> = {
  ail: "ails",
  chou: "choux",
  oeil: "yeux",
  oeuf: "oeufs",
  "œuf": "œufs",
  bijou: "bijoux",
  caillou: "cailloux",
  genou: "genoux",
  hibou: "hiboux",
  joujou: "joujoux",
  pou: "poux",
};

/**
 * Préserve la casse d'origine sur le mot transformé
 */
const matchCase = (original: string, transformed: string): string => {
  if (!original || !transformed) return transformed;
  if (original === original.toUpperCase()) return transformed.toUpperCase();
  if (original[0] === original[0].toUpperCase()) {
    return transformed[0].toUpperCase() + transformed.slice(1);
  }
  return transformed;
};

/**
 * Pluralise un mot individuel selon les règles de la grammaire française
 */
export const pluralizeSingleWord = (word: string): string => {
  if (!word) return "";
  const lower = word.toLowerCase();

  // 1. Exceptions directes
  if (IRREGULAR_PLURALS[lower]) {
    return matchCase(word, IRREGULAR_PLURALS[lower]);
  }

  // 2. Mots déjà terminés par s, x, z -> invariables
  if (lower.endsWith("s") || lower.endsWith("x") || lower.endsWith("z")) {
    return word;
  }

  // 3. Mots en -eau -> -eaux
  if (lower.endsWith("eau")) {
    return matchCase(word, lower + "x");
  }

  // 4. Mots en -au -> -aux (sauf landau, sarrau)
  if (lower.endsWith("au")) {
    if (lower === "landau" || lower === "sarrau") {
      return matchCase(word, lower + "s");
    }
    return matchCase(word, lower + "x");
  }

  // 5. Mots en -eu -> -eux (sauf bleu, pneu, émeu)
  if (lower.endsWith("eu")) {
    if (
      lower === "bleu" ||
      lower === "pneu" ||
      lower === "emeu" ||
      lower === "émeu"
    ) {
      return matchCase(word, lower + "s");
    }
    return matchCase(word, lower + "x");
  }

  // 6. Mots en -al -> -aux (sauf exceptions régulières)
  if (lower.endsWith("al")) {
    const alExceptions = [
      "bal",
      "carnaval",
      "festival",
      "chacal",
      "recital",
      "récital",
      "regal",
      "régal",
    ];
    if (alExceptions.includes(lower)) {
      return matchCase(word, lower + "s");
    }
    return matchCase(word, lower.slice(0, -2) + "aux");
  }

  // 7. Mots en -ail -> -ails (sauf les 7 en -aux)
  if (lower.endsWith("ail")) {
    const ailExceptions = [
      "bail",
      "corail",
      "email",
      "émail",
      "soupirail",
      "travail",
      "vantail",
      "vitrail",
    ];
    if (ailExceptions.includes(lower)) {
      return matchCase(word, lower.slice(0, -3) + "aux");
    }
    return matchCase(word, lower + "s");
  }

  // 8. Règle générale : ajout de "s"
  return matchCase(word, lower + "s");
};

/**
 * Pluralise un segment de mots (gérant les tirets et les espaces)
 */
const pluralizeSegment = (segment: string): string => {
  if (segment.includes("-")) {
    return segment.split("-").map(pluralizeSingleWord).join("-");
  }
  return segment.split(/\s+/).map(pluralizeSingleWord).join(" ");
};

/**
 * Pluralise un nom d'ingrédient en français en tenant compte :
 * - des prépositions ("Pomme de terre" -> "Pommes de terre", "Gousse d'ail" -> "Gousses d'ail", "Cuillère à soupe" -> "Cuillères à soupe")
 * - des ingrédients indénombrables ("Farine", "Beurre", "Sel")
 * - des composés ("Tomate cerise" -> "Tomates cerises", "Chou-fleur" -> "Choux-fleurs")
 */
export const pluralizeFrenchIngredient = (name: string): string => {
  if (!name || typeof name !== "string") return "";
  const trimmed = name.trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  if (UNCOUNTABLE_INGREDIENTS.has(lower)) {
    return trimmed;
  }

  // Détection des prépositions qui séparent le nom principal du complément
  // ex : " de ", " d'", " à ", " au ", " aux ", " du ", " des "
  const prepMatch = trimmed.match(
    /^(.+?)(\s+(?:de\s+|d['’]|à\s+|au\s+|aux\s+|du\s+|des\s+).+)$/i,
  );
  if (prepMatch) {
    const head = prepMatch[1];
    const tail = prepMatch[2];
    if (UNCOUNTABLE_INGREDIENTS.has(head.toLowerCase())) {
      return trimmed;
    }
    return pluralizeSegment(head) + tail;
  }

  return pluralizeSegment(trimmed);
};

/**
 * Extrait une valeur numérique depuis une chaîne de quantité.
 * Supporte les nombres décimaux ("1.5", "1,5"), fractions ("1/2", "½"),
 * et les formats avec unités ("200g", "2 c. à soupe").
 */
export const parseQuantity = (
  rawQty: string | undefined | null,
): number | null => {
  if (!rawQty || typeof rawQty !== "string") return null;
  const trimmed = rawQty.trim();
  if (!trimmed) return null;

  // Fractions usuelles en un seul caractère unicode
  const vulgarFractions: Record<string, number> = {
    "½": 0.5,
    "⅓": 0.333,
    "⅔": 0.667,
    "¼": 0.25,
    "¾": 0.75,
    "⅛": 0.125,
    "⅜": 0.375,
    "⅝": 0.625,
    "⅞": 0.875,
  };

  for (const [char, val] of Object.entries(vulgarFractions)) {
    if (trimmed.includes(char)) {
      const remaining = trimmed.replace(char, "").trim();
      const baseMatch = remaining.match(/^(\d+(?:[\.,]\d+)?)/);
      const base = baseMatch ? parseFloat(baseMatch[1].replace(",", ".")) : 0;
      return base + val;
    }
  }

  // Fractions avec barre oblique (ex : "1/2", "3/4", "3 / 2")
  const fractionMatch = trimmed.match(
    /^(\d+(?:[\.,]\d+)?)\s*\/\s*(\d+(?:[\.,]\d+)?)/,
  );
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1].replace(",", "."));
    const den = parseFloat(fractionMatch[2].replace(",", "."));
    if (den !== 0 && !isNaN(num) && !isNaN(den)) {
      return num / den;
    }
  }

  // Nombre au début (ex : "2", "2.5", "2,5", "200g", "2 c. à soupe")
  const numberMatch = trimmed.match(/^(\d+(?:[\.,]\d+)?)/);
  if (numberMatch) {
    const val = parseFloat(numberMatch[1].replace(",", "."));
    return isNaN(val) ? null : val;
  }

  return null;
};

/**
 * Détermine si une quantité est strictement supérieure à 1
 */
export const isQuantityPlural = (
  rawQty: string | undefined | null,
): boolean => {
  const qty = parseQuantity(rawQty);
  return qty !== null && qty > 1;
};
