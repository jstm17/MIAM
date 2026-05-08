import lidlLogo from "@/assets/lidl-logo.png";
import type { Ingredient } from "@/types/ingredient.types";
import { ShoppingBasket } from "lucide-react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type IngredientCardProps = {
  ingredient: Ingredient;
  ingredientName?: string;
  quantity?: string;
  isSaved?: boolean;
  disabled?: boolean;
  showButton?: boolean;
  onToggleCart?: () => void;
  icon?: React.ReactNode;
  lidl?: boolean;
};

export const IngredientCard = ({
  ingredient,
  ingredientName,
  quantity,
  isSaved = false,
  disabled = false,
  showButton = true,
  icon = (
    <ShoppingBasket
      fill={isSaved ? "currentColor" : "transparent"}
      className="text-white"
    />
  ),
  onToggleCart,
  lidl = false,
}: IngredientCardProps) => {
  const searchProduct = (product: string) => {
    const url = `https://www.lidl.fr/q/search?q=${encodeURIComponent(product)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col items-center gap-1 relative">
      {lidl && (
        <img
          src={lidlLogo}
          alt="Lidl"
          className="w-8 h-8 object-contain absolute top-2 right-2 z-10 cursor-pointer rounded-md"
          onClick={() => searchProduct(ingredient.name)}
        />
      )}
      {showButton && onToggleCart && (
        <Button
          variant="outline"
          aria-label={isSaved ? "Retirer du panier" : "Ajouter au panier"}
          size="icon"
          disabled={disabled}
          onClick={onToggleCart}
          className={`absolute top-2 ${lidl ? "left-2" : "right-2"} z-10 backdrop-blur-xs bg-black/10 dark:bg-black/10 hover:bg-muted/10 active:bg-muted/10 aria-expanded:bg-muted/10`}
        >
          {icon}
        </Button>
      )}

      <AspectRatio
        ratio={1}
        className="rounded-xl overflow-hidden border bg-white"
      >
        {ingredient.url ? (
          <img
            src={ingredient.url}
            alt={ingredientName || ingredient.name}
            className="object-contain h-full w-full"
          />
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </AspectRatio>
      <p className="text-center">
        {quantity ? (
          <span className="font-semibold block">{quantity}</span>
        ) : null}
        <span>{ingredientName || ingredient.name}</span>
      </p>
    </div>
  );
};
