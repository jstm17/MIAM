import { useGetAllRecipesByUserId } from "@/hooks/recipes/useGetAllRecipesByUserId";
import type { User } from "@/types/user.types";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HomeContentSkeleton } from "../home/skeletons/HomeContentSkeleton";
import { RecipeCard } from "../recipe-card/RecipeCard";
import { RecipesFilters } from "../recipe-card/RecipesFilters";

type UserContentProps = {
  user: User;
};

export const UserContent = ({ user }: UserContentProps) => {
  const { recipes, setRecipes, totalRecipes, setTotalRecipes, loading } =
    useGetAllRecipesByUserId(user._id);
  const [sort, setSort] = useState("recent");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const allCategories = Array.from(
      new Set(recipes.flatMap((r) => r.categories).map((c) => c.name)),
    );
    setSelectedCategories(allCategories);
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((recipe) =>
        recipe.categories.some((c) => selectedCategories.includes(c.name)),
      )
      .sort((a, b) =>
        sort === "recent"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [recipes, selectedCategories, sort]);

  if (loading) {
    return <HomeContentSkeleton />;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <RecipesFilters
        title={totalRecipes > 1 ? "recettes disponibles" : "recette disponible"}
        originalRecipes={recipes}
        totalElement={filteredRecipes.length}
        sort={sort}
        setSort={setSort}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      {filteredRecipes.map((recipe) => (
        <Link to={`/recipe/${recipe.slug}`} key={recipe.slug}>
          <RecipeCard
            recipe={recipe}
            onRemove={(id) => {
              setRecipes((prev) => prev.filter((r) => r._id !== id));
              setTotalRecipes((prev) => prev - 1);
            }}
          />
        </Link>
      ))}
    </div>
  );
};
