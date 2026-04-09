import type { Recipe } from "@/types/recipe.types";
import { Frown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyCard } from "../recipe-card/EmptyCard";
import { RecipeCard } from "../recipe-card/RecipeCard";
import { RecipesFilters } from "../recipe-card/RecipesFilters";

type ProfileSavedRecipesContentProps = {
  recipes: Recipe[];
  totalElement: number;
};
export const ProfileSavedRecipesContent = ({
  recipes,
  totalElement,
}: ProfileSavedRecipesContentProps) => {
  const navigate = useNavigate();

  const [sort, setSort] = useState("recent");

  const allCategories = useMemo(
    () =>
      Array.from(
        new Set(
          recipes
            .flatMap((r) => r?.categories || [])
            .map((c) => c?.name)
            .filter(Boolean),
        ),
      ),
    [recipes],
  );

  const allChefs = useMemo(
    () =>
      Array.from(
        new Set(recipes.map((recipe) => recipe.addedBy?._id).filter(Boolean)),
      ),
    [recipes],
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCategories(allCategories);
    setSelectedUsers(allChefs as string[]);
  }, [allCategories, allChefs]);

  const filteredRecipes = useMemo(() => {
    return recipes
      .filter(
        (recipe) =>
          recipe?.categories?.some((c) =>
            selectedCategories.includes(c.name),
          ) && selectedUsers.includes(recipe.addedBy?._id ?? ""),
      )
      .sort((a, b) =>
        sort === "recent"
          ? new Date(b.savedAt || b.createdAt).getTime() -
            new Date(a.savedAt || a.createdAt).getTime()
          : new Date(a.savedAt || a.createdAt).getTime() -
            new Date(b.savedAt || b.createdAt).getTime(),
      );
  }, [recipes, selectedCategories, selectedUsers, sort]);

  if (totalElement === 0) {
    return (
      <EmptyCard
        icon={<Frown />}
        description="Vous n'avez enregistré aucune recette."
        buttonText="Voir les recettes"
        onButtonClick={() => {
          navigate("/");
        }}
      />
    );
  }
  return (
    <>
      <RecipesFilters
        title={
          totalElement > 1 ? "recettes enregistrées" : "recette enregistrée"
        }
        originalRecipes={recipes}
        totalElement={filteredRecipes.length}
        sort={sort}
        setSort={setSort}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      {filteredRecipes.map((recipe) => (
        <Link to={`/recipe/${recipe.slug}`} key={recipe.slug}>
          <RecipeCard recipe={recipe} />
        </Link>
      ))}
    </>
  );
};
