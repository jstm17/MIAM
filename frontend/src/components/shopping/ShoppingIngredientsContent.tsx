import { IngredientCard } from "@/components/ingredient/IngredientCard";
import { Typography } from "@/components/shared/Typography";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRemoveIngredientFromCart } from "@/hooks/users/useRemoveIngredientFromCart";
import type { Ingredient } from "@/types/ingredient.types";
import type { Recipe } from "@/types/recipe.types";
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

  const recipesMap = new Map<
    string,
    {
      recipe: Recipe;
      ingredients: Array<{
        ingredient: Ingredient;
        quantity: string;
        label?: string;
      }>;
    }
  >();

  savedIngredients.forEach((item) => {
    if (!item.recipe || !item.ingredient) return;

    const recipeId = item.recipe._id;

    if (!recipesMap.has(recipeId)) {
      recipesMap.set(recipeId, {
        recipe: item.recipe,
        ingredients: [],
      });
    }

    const recipeIngredient = item.recipe.ingredients.find(
      (ri: any) =>
        (ri.ingredient?._id || ri.ingredient) === item.ingredient._id,
    );

    recipesMap.get(recipeId)?.ingredients.push({
      ingredient: item.ingredient,
      quantity: recipeIngredient?.quantity || "",
      label: item.label || recipeIngredient?.label,
    });
  });

  const groupedRecipes = Array.from(recipesMap.values());

  const handleRemoveIngredientFromCart = async (
    recipeId: string,
    ingredientId: string,
  ) => {
    setLoadingIds((prev) => new Set(prev).add(ingredientId));
    try {
      await removeIngredientFromCart(recipeId, ingredientId);
      toast.success("Ingrédient retiré");
    } catch {
      toast.error("Erreur lors du retrait");
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
            <div className="flex items-center gap-2 max-w-full overflow-hidden">
              <UtensilsCrossed size={20} />
              <Typography className="text-lg truncate" weight="semibold">
                {recipe.name}
              </Typography>
            </div>
            <Link to={`/recipe/${recipe.slug}`}>
              <Button size="icon" variant="ghost">
                <ChevronRight />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm px-4">
            {ingredients.map(({ ingredient, quantity, label }) => (
              <IngredientCard
                key={`${recipe._id}-${ingredient._id}`}
                ingredient={ingredient}
                ingredientName={label || ingredient.name}
                quantity={quantity}
                icon={<Minus color="white" />}
                isSaved={true}
                disabled={
                  loadingIds.has(ingredient._id) || isLoadingAuth || !user
                }
                onToggleCart={() =>
                  handleRemoveIngredientFromCart(recipe._id, ingredient._id)
                }
                lidl
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
