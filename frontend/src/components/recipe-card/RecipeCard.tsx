import placeholderImage from "@/assets/placeholder-image.jpg";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Recipe } from "@/types/recipe.types";
import { UserRound } from "lucide-react";
import { AspectRatio } from "../ui/aspect-ratio";
import { RecipeCardActions } from "./RecipeCardActions";

type RecipeCardProps = {
  recipe: Recipe;
};

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { name, categories, image, addedBy } = recipe;

  return (
    <Card className="relative mx-auto w-full gap-0 rounded-2xl p-0">
      <RecipeCardActions recipe={recipe} />
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
        <CardTitle className="flex justify-between items-center gap-4">
          {name}
          <Badge variant={"ghost"} className="text-foreground/50 p-0">
            <UserRound /> {addedBy.name}
          </Badge>
        </CardTitle>
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
