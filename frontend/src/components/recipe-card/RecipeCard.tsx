import placeholderImage from "@/assets/placeholder-image.jpg";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Recipe } from "@/types/recipe.types";
import { formatTime } from "@/utils/formatTime";
import { ChefHat, EyeOff, Timer, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";
import { RecipeCardActions } from "./RecipeCardActions";

type RecipeCardProps = {
  recipe: Recipe;
};

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const {
    name,
    categories,
    image,
    addedBy,
    visible,
    slug,
    timePrep,
    timeCook,
    personsNumber,
  } = recipe;

  return (
    <Card className="relative mx-auto w-full gap-0 rounded-2xl p-0 active:brightness-95 overflow-hidden group">
      {!visible && (
        <div className="absolute top-2 left-2 z-20">
          <EyeOff color="white" className="drop-shadow-sm" />
        </div>
      )}

      <RecipeCardActions recipe={recipe} />

      <Link to={`/recipe/${slug}`} className="block">
        <AspectRatio ratio={21 / 9} className="bg-muted">
          {image ? (
            <img
              src={image}
              alt="Photo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
              }}
            />
          ) : (
            <Skeleton className="w-full h-full bg-border rounded-b-none" />
          )}
        </AspectRatio>
        <div>
          <CardHeader className="p-2 bg-background rounded-none gap-2">
            <CardTitle className="flex justify-between items-center gap-4">
              {name}
            </CardTitle>
            <CardDescription className="flex gap-1">
              {categories.map((category) => (
                <Badge key={category._id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </CardDescription>
            <CardAction className="flex-col flex items-end justify-between h-full max-h-13">
              <div className="text-muted-foreground/80 flex gap-1 p-0 items-center">
                <ChefHat size={12} />
                <span className="text-xs mt-px">{addedBy.name}</span>
              </div>
              {(timePrep > 0 || timeCook > 0) && (
                <div className="text-muted-foreground/80 flex gap-1 p-0 items-center">
                  <Timer size={12} />
                  <span className="text-xs mt-px">
                    {formatTime(timePrep + timeCook, true)}
                  </span>
                </div>
              )}
              {personsNumber > 0 && (
                <div className="text-muted-foreground/80 flex gap-1 p-0 items-center">
                  <UsersRound size={12} />
                  <span className="text-xs mt-px">{personsNumber ?? 0}</span>
                </div>
              )}
            </CardAction>
          </CardHeader>
        </div>
      </Link>
    </Card>
  );
};
