import type { Recipe } from "@/types/recipe.types";
import { useNavigate } from "react-router-dom";
import { EmptyCard } from "../recipe-card/EmptyCard";
import { RecipeCard } from "../recipe-card/RecipeCard";
import { RecipesFilters } from "../recipe-card/RecipesFilters";

import { useMemo, useState } from "react";

type ProfileMyRecipeContentProps = {
  recipes: Recipe[];
  totalElement: number;
};

export const ProfileMyRecipesContent = ({
  recipes,
  totalElement,
}: ProfileMyRecipeContentProps) => {
  const navigate = useNavigate();
  const [sort, setSort] = useState("recent");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    Array.from(
      new Set(recipes.flatMap((r) => r.categories).map((c) => c.name)),
    ),
  );
  const [selectedVisibility, setSelectedVisibility] = useState<string[]>([
    "visible",
    "hidden",
  ]);

  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((recipe) =>
        recipe.categories.some((c) => selectedCategories.includes(c.name)),
      )
      .filter((recipe) =>
        selectedVisibility.includes(recipe.visible ? "visible" : "hidden"),
      )
      .sort((a, b) =>
        sort === "recent"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [recipes, selectedCategories, selectedVisibility, sort]);

  if (totalElement === 0) {
    return (
      <EmptyCard
        title="0 recette disponible"
        description="Vous n'avez ajouté aucune recette."
        buttonText="Ajouter une recette"
        onButtonClick={() => navigate("/recipe-add")}
      />
    );
  }

  return (
    <>
      <RecipesFilters
        title={totalElement > 1 ? "recettes ajoutées" : "recette ajoutée"}
        originalRecipes={recipes}
        totalElement={filteredRecipes.length}
        sort={sort}
        setSort={setSort}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedVisibility={selectedVisibility}
        setSelectedVisibility={setSelectedVisibility}
      />
      {filteredRecipes.map((recipe) => (
        <RecipeCard recipe={recipe} key={recipe.slug} />
      ))}
    </>
  );
};
