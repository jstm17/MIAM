export const parseClipboardSteps = (text: string): string[] => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const steps: string[] = [];
  let currentStep = "";

  // Détection de la présence de marqueurs "Étape X" ou "Pour finir"
  const isEtapeFormat = lines.some((l) =>
    /^(?:étape\s*\d+|step\s*\d+|pour finir)/i.test(l),
  );

  // Détection d'une liste numérotée, même si elle ne commence pas par 1 (ex: texte, puis 2, 3...)
  let numberedListCount = 0;
  let lastNum = -1;
  let firstValidNum = -1;
  let currentPotentialStart = -1;

  for (const l of lines) {
    const m = l.match(/^(\d+)/);
    if (m) {
      const num = parseInt(m[1], 10);
      if (lastNum !== -1 && num === lastNum + 1) {
        numberedListCount++;
        if (firstValidNum === -1) {
          firstValidNum = currentPotentialStart;
        }
      } else {
        currentPotentialStart = num;
      }
      lastNum = num;
    }
  }

  // On considère que c'est une liste numérotée si on a trouvé au moins une suite (ex: 2 puis 3)
  const isNumberedFormat = numberedListCount >= 1;

  // S'il n'y a aucun marqueur, on considère simplement chaque paragraphe comme une étape !
  if (!isEtapeFormat && !isNumberedFormat) {
    return lines;
  }

  // S'il y a des marqueurs, on les utilise pour grouper les lignes
  let nextExpectedNum = firstValidNum !== -1 ? firstValidNum : 1;

  for (const line of lines) {
    let isMarker = false;
    let contentWithoutMarker = line;

    if (isEtapeFormat) {
      const match = line.match(
        /^(?:étape\s*\d+|step\s*\d+|pour finir)[:\s\-\.]*/i,
      );
      if (match) {
        isMarker = true;
        contentWithoutMarker = line.slice(match[0].length).trim();
      }
    }

    if (!isMarker && isNumberedFormat) {
      // Vérifie si la ligne commence par le numéro attendu
      const m = line.match(/^(\d+)[\.\)-\s]*/);
      if (m && parseInt(m[1], 10) === nextExpectedNum) {
        isMarker = true;
        contentWithoutMarker = line.slice(m[0].length).trim();
        nextExpectedNum++;
      }
    }

    if (isMarker) {
      // On sauvegarde l'étape précédente s'il y en avait une
      if (currentStep) {
        steps.push(currentStep.trim());
      }
      currentStep = contentWithoutMarker;
    } else {
      // On ajoute la ligne à l'étape en cours
      currentStep = currentStep ? `${currentStep}\n${line}` : line;
    }
  }

  if (currentStep) {
    steps.push(currentStep.trim());
  }

  return steps.filter(Boolean);
};
