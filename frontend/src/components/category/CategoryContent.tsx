import { useGetAllVisiblesByCategory } from "@/hooks/recipes/useGetAllRecipesVibsiblesByCategory";
import type { Category } from "@/types/category.types";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HomeContentSkeleton } from "../home/skeletons/HomeContentSkeleton";
import { RecipeCard } from "../recipe-card/RecipeCard";
import { RecipesFilters } from "../recipe-card/RecipesFilters";

type CategoryContentProps = {
  category: Category;
};

export const CategoryContent = ({ category }: CategoryContentProps) => {
  const { recipes, totalRecipes, isLoading } = useGetAllVisiblesByCategory(
    category.slug,
  );
  const [sort, setSort] = useState("recent");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const allCategories = Array.from(
      new Set(recipes.flatMap((r) => r.categories).map((c) => c.name)),
    );
    setSelectedCategories(allCategories);

    const allUsers = Array.from(
      new Set(recipes.map((recipe) => recipe.addedBy?._id).filter(Boolean)),
    );
    setSelectedUsers(allUsers as string[]);
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes
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
  }, [recipes, selectedCategories, selectedUsers, sort]);

  if (isLoading) {
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
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      {filteredRecipes.map((recipe) => (
        <Link to={`/recipe/${recipe.slug}`} key={recipe.slug}>
          <RecipeCard recipe={recipe} />
        </Link>
      ))}
    </div>
  );
};
