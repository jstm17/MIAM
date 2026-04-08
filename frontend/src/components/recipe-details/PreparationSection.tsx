import type { Recipe } from "@/types/recipe.types";
import { Typography } from "../shared/Typography";

export const PreparationSection = ({ recipe }: { recipe: Recipe }) => {
  const { instructions } = recipe;

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
