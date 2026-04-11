import type { Recipe } from "@/types/recipe.types";
import { Carrot } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HomeContentSkeleton } from "../home/skeletons/HomeContentSkeleton";
import { EmptyCard } from "../recipe-card/EmptyCard";
import { RecipeCard } from "../recipe-card/RecipeCard";
import { RecipesFilters } from "../recipe-card/RecipesFilters";
type IngredientsContentResultsProps = {
  selectedIngredients: string[];
  resultRecipes: Recipe[];
  isLoading: boolean;
};
export const IngredientsContentResults = ({
  selectedIngredients,
  resultRecipes,

  isLoading,
}: IngredientsContentResultsProps) => {
  const [sort, setSort] = useState("recent");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const allCategories = Array.from(
      new Set(resultRecipes.flatMap((r) => r.categories).map((c) => c.name)),
    );
    setSelectedCategories(allCategories);

    const allUsers = Array.from(
      new Set(
        resultRecipes.map((recipe) => recipe.addedBy?._id).filter(Boolean),
      ),
    );
    setSelectedUsers(allUsers as string[]);
  }, [resultRecipes]);

  const filteredRecipes = useMemo(() => {
    return resultRecipes
      .filter(
        (recipe) =>
          recipe.categories.some((c) => selectedCategories.includes(c.name)) &&
          selectedUsers.includes(recipe.addedBy?._id ?? ""),
      )
      .sort((a, b) =>
        sort === "recent"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [resultRecipes, selectedCategories, selectedUsers, sort]);

  const test = false;
  if (isLoading || test) {
    return <HomeContentSkeleton />;
  }

  if (selectedIngredients.length === 0) {
    return (
      <div>
        <EmptyCard
          title="Aucun ingrédient sélectionné"
          description="Sélectionnez au moins un ingrédient pour afficher les recettes."
          icon={<Carrot size={48} />}
          className="bg-muted p-0 pt-4 w-[100wh]"
          iconClassName="bg-muted-foreground/10"
        />
      </div>
    );
  }
  if (resultRecipes.length === 0) {
    return (
      <div>
        <EmptyCard
          title="0 recette trouvée"
          description="Aucune recette trouvée avec ces ingrédients"
          className="bg-muted p-0 pt-4 w-[100wh]"
          iconClassName="bg-muted-foreground/10"
        />
      </div>
    );
  }

  const title = `recette${filteredRecipes.length > 1 ? "s" : ""} contenant ${
    selectedIngredients.length > 1 ? "ces ingrédients" : "cet ingrédient"
  } :`;

  return (
    <div className="w-full flex flex-col gap-4">
      <RecipesFilters
        title={title}
        originalRecipes={resultRecipes}
        totalElement={filteredRecipes.length}
        sort={sort}
        setSort={setSort}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      {filteredRecipes.map((recipe) => (
        <Link to={`/recipe/${recipe.slug}`} key={recipe._id}>
          <RecipeCard recipe={recipe} />
        </Link>
      ))}
    </div>
  );
};
