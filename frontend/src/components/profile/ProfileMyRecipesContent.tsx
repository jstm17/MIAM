import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "../ui/button";
import type { Recipe } from "@/types/recipe.types";
import { RecipeCard } from "../recipe-card/RecipeCard";
import { Link } from "react-router-dom";

type ProfileMyRecipeContentProps = {
  recipes: Recipe[];
  totalElement: number;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setTotalRecipes: React.Dispatch<React.SetStateAction<number>>;
};
export const ProfileMyRecipesContent = ({
  recipes,
  totalElement,
  setRecipes,
  setTotalRecipes,
}: ProfileMyRecipeContentProps) => {
  if (totalElement === 0) {
    return (
      <Item variant="default">
        <ItemContent className="items-center gap-2 mt-2">
          <ItemTitle>Vous n'avez ajouté aucune recette.</ItemTitle>
          <ItemDescription>
            <Link to="/recipe-add">
              <Button variant="outline" size="sm">
                Ajouter une recette
              </Button>
            </Link>
          </ItemDescription>
        </ItemContent>
      </Item>
    );
  }
  return (
    <>
      {recipes.map((recipe) => (
        <Link to={`/recipe/${recipe._id}`} key={recipe._id}>
          <RecipeCard
            recipe={recipe}
            onRemove={(id) => {
              setRecipes((prev) => prev.filter((r) => r._id !== id));
              setTotalRecipes((prev) => prev - 1);
            }}
          />
        </Link>
      ))}
    </>
  );
};
