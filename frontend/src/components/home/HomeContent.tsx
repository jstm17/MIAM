import { useGetAllRecipes } from "@/hooks/recipes/useGetAllRecipes";
import { Frown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyCard } from "../recipe-card/EmptyCard";
import { RecipeCard } from "../recipe-card/RecipeCard";
import { RecipesFilters } from "../recipe-card/RecipesFilters";
import { HomeContentSkeleton } from "./skeletons/HomeContentSkeleton";

export const HomeContent = () => {
  const { recipes, setRecipes, totalRecipes, setTotalRecipes, loading } =
    useGetAllRecipes();
  console.log(recipes);
  const navigate = useNavigate();
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

  if (totalRecipes === 0) {
    return (
      <EmptyCard
        icon={<Frown />}
        description="Vous n'avez ajouté aucune recette."
        buttonText="Ajouter une recette"
        onButtonClick={() => navigate("/recipe-add")}
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
      />
      {filteredRecipes.map((recipe) => (
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
    </div>
  );
};
