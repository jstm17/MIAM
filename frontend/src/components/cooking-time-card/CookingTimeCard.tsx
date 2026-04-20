import AirfryerIcon from "@/assets/airfryer.svg?react";
import InstantPotIcon from "@/assets/instant-pot.svg?react";
import placeholderImage from "@/assets/placeholder-image.jpg";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CookingTime } from "@/types/cookingTime.types";
import { ChefHat, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";
import { CookingTimeCardActions } from "./CookingTimeCardActions";

type CookingTimeCardProps = {
  cookingTime: CookingTime;
};

export const CookingTimeCard = ({ cookingTime }: CookingTimeCardProps) => {
  const { name, categories, image, addedBy, visible, slug, device } =
    cookingTime;

  return (
    <Card className="relative mx-auto w-full gap-0 rounded-2xl p-0 active:brightness-95 overflow-hidden group">
      {!visible && (
        <div className="absolute top-2 left-2 z-20">
          <EyeOff color="white" className="drop-shadow-sm" />
        </div>
      )}

      <CookingTimeCardActions cookingTime={cookingTime} />

      <Link to={`/cooking-time/${slug}`} className="block">
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
            <CardAction className="flex-col flex items-end h-full gap-2">
              <div className="text-muted-foreground/80 flex gap-1 p-0 items-center">
                <ChefHat size={12} />
                <span className="text-xs mt-px">{addedBy.name}</span>
              </div>
              {device &&
                (() => {
                  const Icon =
                    device === "Instant Pot" ? InstantPotIcon : AirfryerIcon;
                  return <Icon className="h-5 w-5 text-muted-foreground/80" />;
                })()}
            </CardAction>
          </CardHeader>
        </div>
      </Link>
    </Card>
  );
};
