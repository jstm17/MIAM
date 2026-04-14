import { IngredientCard } from "@/components/ingredient/IngredientCard";
import { useRemoveIngredientFromCart } from "@/hooks/users/useRemoveIngredientFromCart";
import type { Recipe } from "@/types/recipe.types";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { useAddIngredientToCart } from "../../hooks/users/useAddIngredientToCart";

export const IngredientsSection = ({ recipe }: { recipe: Recipe }) => {
  const { ingredients } = recipe;
  const { user, isLoading } = useAuth();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const { addIngredientToCart } = useAddIngredientToCart();
  const { removeIngredientFromCart } = useRemoveIngredientFromCart();

  const handleToggleCart = async (ingredientId: string, isSaved: boolean) => {
    if (!user) {
      toast.error("Connectez-vous pour utiliser le panier");
      return;
    }

    setLoadingIds((prev) => new Set(prev).add(ingredientId));
    try {
      if (isSaved) {
        await removeIngredientFromCart(recipe._id, ingredientId);
        toast.success("Ingrédient retiré du panier");
      } else {
        await addIngredientToCart(recipe._id, ingredientId);
        toast.success("Ingrédient ajouté au panier");
      }
    } catch {
      toast.error("Impossible de mettre à jour le panier");
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(ingredientId);
        return next;
      });
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {ingredients.map((ingredient) => {
        if (!ingredient.ingredient) return null;

        const isSaved = user?.savedIngredients?.some(
          (savedIngredient) =>
            savedIngredient.ingredient &&
            savedIngredient.recipe &&
            savedIngredient.ingredient._id === ingredient.ingredient._id &&
            savedIngredient.recipe._id === recipe._id,
        );

        return (
          <IngredientCard
            key={ingredient.ingredient._id}
            ingredient={ingredient.ingredient}
            quantity={ingredient.quantity}
            isSaved={Boolean(isSaved)}
            disabled={
              loadingIds.has(ingredient.ingredient._id) || isLoading || !user
            }
            onToggleCart={() =>
              handleToggleCart(ingredient.ingredient._id, Boolean(isSaved))
            }
          />
        );
      })}
    </div>
  );
};
