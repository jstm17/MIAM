import { useGetAllRecipesVisibles } from "@/hooks/recipes/useGetAllRecipesVisibles";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeCard } from "../recipe-card/RecipeCard";
import { RecipesFilters } from "../recipe-card/RecipesFilters";
import { EmptyCard } from "../shared/EmptyCard";
import { HomeContentSkeleton } from "./skeletons/HomeContentSkeleton";

export const HomeContent = () => {
  const { recipes, totalRecipes, isLoading } = useGetAllRecipesVisibles();
  const navigate = useNavigate();
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

  if (totalRecipes === 0) {
    return (
      <EmptyCard
        title="0 recette disponible"
        description="Personne n'a ajouté de recette."
        buttonText="Ajouter une recette"
        onButtonClick={() => navigate("/add")}
      />
    );
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
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      {filteredRecipes.map((recipe) => (
        <RecipeCard recipe={recipe} key={recipe.slug} />
      ))}
    </div>
  );
};
