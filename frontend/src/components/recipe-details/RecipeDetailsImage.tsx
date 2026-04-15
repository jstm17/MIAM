import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Recipe } from "@/types/recipe.types";
import { motion, MotionValue } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
import { RecipeDetailsImageActions } from "./RecipeDetailsImageActions";

type RecipeDetailsImageProps = {
  recipe: Recipe;
  y: MotionValue<string>;
};
export const RecipeDetailsImage = ({ recipe, y }: RecipeDetailsImageProps) => {
  return (
    <div className="relative">
      <RecipeDetailsImageActions recipe={recipe} />
      <AspectRatio ratio={1} className=" overflow-hidden">
        {recipe?.image ? (
          <motion.img
            src={recipe?.image}
            alt="Recipe"
            className="absolute inset-0 object-cover w-full h-full "
            style={{
              y,
            }}
          />
        ) : (
          <Skeleton className="w-full h-full bg-border" />
        )}
      </AspectRatio>
    </div>
  );
};
