import placeholderImage from "@/assets/placeholder-image.jpg";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Recipe } from "@/types/recipe.types";
import { AspectRatio } from "../ui/aspect-ratio";
import { RecipeCardActions } from "./RecipeCardActions";

type RecipeCardProps = {
  recipe: Recipe;
  onRemove?: (id: string) => void;
};

export const RecipeCard = ({ recipe, onRemove }: RecipeCardProps) => {
  const { name, categories, image } = recipe;
  console.log(recipe);
  return (
    <Card className="relative mx-auto w-full gap-0 rounded-2xl p-0">
      <RecipeCardActions recipe={recipe} onRemove={onRemove} />
      <AspectRatio ratio={21 / 9} className="bg-muted">
        <img
          src={image || placeholderImage}
          alt="Photo"
          className="w-full h-full object-cover dark:brightness-20"
          onError={(e) => {
            e.currentTarget.src = placeholderImage;
          }}
        />
      </AspectRatio>
      <CardHeader className="p-2 bg-white">
        <CardTitle>{name}</CardTitle>
        <CardDescription className="flex gap-2">
          {categories.map((category) => (
            <Badge key={category._id} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
