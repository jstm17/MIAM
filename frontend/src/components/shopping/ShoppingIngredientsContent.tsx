import { IngredientCard } from "@/components/ingredient/IngredientCard";
import { Typography } from "@/components/shared/Typography";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRemoveIngredientFromCart } from "@/hooks/users/useRemoveIngredientFromCart";
import type { Ingredient } from "@/types/ingredient.types";
import { ChevronRight, Minus, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const ShoppingIngredientsContent = () => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { removeIngredientFromCart } = useRemoveIngredientFromCart();
  const { savedIngredients } = user || {};
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  if (!savedIngredients || savedIngredients.length === 0) {
    return null;
  }

  const recipesMap = new Map(
    savedIngredients
      .filter((item) => item.recipe)
      .map((item) => [
        item.recipe!._id,
        {
          recipe: item.recipe!,
          ingredients: new Map<
            string,
            { ingredient: Ingredient; quantity: string }
          >(),
        },
      ]),
  );

  savedIngredients
    .filter((item) => item.recipe && item.ingredient)
    .forEach((item) => {
      const entry = recipesMap.get(item.recipe!._id);
      const savedIngredientQuantity = item.recipe!.ingredients.find(
        (recipeIngredient) =>
          recipeIngredient.ingredient?._id === item.ingredient._id,
      )?.quantity;

      if (entry) {
        entry.ingredients.set(item.ingredient._id, {
          ingredient: item.ingredient,
          quantity: savedIngredientQuantity ?? "",
        });
      }
    });

  const groupedRecipes = Array.from(recipesMap.values()).map((entry) => ({
    recipe: entry.recipe,
    ingredients: Array.from(entry.ingredients.values()),
  }));

  const handleRemoveIngredientFromCart = async (
    recipeId: string,
    ingredientId: string,
  ) => {
    setLoadingIds((prev) => new Set(prev).add(ingredientId));
    try {
      await removeIngredientFromCart(recipeId, ingredientId);
      toast.success("Ingrédient retiré de la liste");
    } catch {
      toast.error("Impossible de retirer l'ingrédient du panier");
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(ingredientId);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 my-4">
      {groupedRecipes.map(({ recipe, ingredients }) => (
        <div key={recipe._id} className="space-y-4">
          <div className="mb-4 p-1 px-4 flex gap-2 items-center justify-between bg-primary/10 border-t border-primary">
            <div className="flex items-center gap-2 max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
              <UtensilsCrossed size={20} />
              <Typography className="text-lg truncate" weight="semibold">
                {recipe.name}
              </Typography>
            </div>
            <Link to={`/recipe/${recipe.slug}`}>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-transparent hover:text-foreground active:bg-transparent active:text-foreground"
              >
                <ChevronRight />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm px-4">
            {ingredients.map(({ ingredient, quantity }) => (
              <IngredientCard
                key={ingredient._id}
                ingredient={ingredient}
                quantity={quantity}
                icon={<Minus color="white" />}
                isSaved={true}
                disabled={
                  loadingIds.has(ingredient._id) || isLoadingAuth || !user
                }
                onToggleCart={() =>
                  handleRemoveIngredientFromCart(recipe._id, ingredient._id)
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
