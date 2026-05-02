export const parseClipboardIngredients = (
  text: string,
): { quantity: string; ingredient: string }[] => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return [];

  // Regex pour capturer une quantité en début de ligne (ex: "1", "1/2", "150 g", "1 cuillère à soupe", "1 pincée")
  const qtyRegex =
    /^([\d\.,\/½⅓¼¾]+(?:-\d+)?)\s*(g|kg|mg|ml|cl|l|dl|c\.?\s*à\s*[sc]\.?|cuillère\w*\s*à\s*(?:soupe|café)|sachet\w*|pincée\w*|bonne\s+pincée|verre\w*|tasse\w*|gousse\w*|tranche\w*|boîte\w*|pot\w*)?\s*(?:de\s|d['’])?\s*(.*)$/i;

  const ingredients: { quantity: string; ingredient: string }[] = [];
  let currentQty = "";
  let currentName = "";

  const pushCurrent = () => {
    if (currentQty || currentName) {
      ingredients.push({
        quantity: currentQty,
        ingredient: currentName,
      });
      currentQty = "";
      currentName = "";
    }
  };

  for (const line of lines) {
    const match = line.match(qtyRegex);

    if (match) {
      const amount = match[1].trim();
      const unit = match[2] ? match[2].trim() : "";
      const name = match[3] ? match[3].trim() : "";

      const qty = unit ? `${amount} ${unit}` : amount;

      if (name) {
        // Format inline: "120 g de beurre mou"
        pushCurrent();
        ingredients.push({ quantity: qty, ingredient: name });
      } else {
        // Quantité seule: "85 g"
        if (currentQty && currentName) {
          pushCurrent();
        } else if (currentQty && !currentName) {
          pushCurrent();
        }
        currentQty = qty;
      }
    } else {
      // Nom d'ingrédient (sans quantité détectée au début)
      const startsWithDe = /^(?:de\s|d['’])/i.test(line);
      const cleanedName = line.replace(/^(?:de\s|d['’])/i, "").trim();

      if (currentQty && currentName) {
        const isExactMatch =
          cleanedName.toLowerCase() === currentName.toLowerCase();
        const isSubstringMatch =
          startsWithDe &&
          (cleanedName.toLowerCase().includes(currentName.toLowerCase()) ||
            currentName.toLowerCase().includes(cleanedName.toLowerCase()));

        if (isExactMatch || isSubstringMatch) {
          // C'est un doublon (ex: Marmiton "85g" -> "de beurre" -> "beurre" -> "85g" -> "de beurre")
          currentName =
            cleanedName.length < currentName.length ? cleanedName : currentName;
        } else {
          pushCurrent();
          currentName = cleanedName;
        }
      } else if (currentName && !currentQty) {
        // Deux noms d'affilée sans quantité (ex: "Sucre" puis "Sucre", ou titre long puis titre court)
        if (
          cleanedName.toLowerCase().includes(currentName.toLowerCase()) ||
          currentName.toLowerCase().includes(cleanedName.toLowerCase())
        ) {
          currentName =
            cleanedName.length < currentName.length ? cleanedName : currentName;
        } else {
          pushCurrent();
          currentName = cleanedName;
        }
      } else {
        currentName = cleanedName;
      }
    }
  }

  pushCurrent();

  return ingredients;
};
