import type { Recipe } from "@/types/recipe.types";
import { ClipboardList } from "lucide-react";
import { EmptyCard } from "../shared/EmptyCard";
import { Typography } from "../shared/Typography";

export const PreparationSection = ({ recipe }: { recipe: Recipe }) => {
  const { instructions, addedBy } = recipe;

  if (instructions.length === 0) {
    return (
      <div>
        <EmptyCard
          icon={<ClipboardList />}
          title="0 instruction ajoutée"
          description={`${addedBy.name} n'a ajouté aucune instruction pour cette recette.`}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {instructions.map((instruction, index) => (
        <div key={index}>
          <Typography weight="semibold">Étape {index + 1}</Typography>
          <p>{instruction.content}</p>
        </div>
      ))}
    </div>
  );
};
