import type { CookingTime } from "@/types/cookingTime.types";
import type { Recipe } from "@/types/recipe.types";
import { Frown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CookingTimeCard } from "../cooking-time-card/CookingTimeCard";
import { RecipeCard } from "../recipe-card/RecipeCard";
import { EmptyCard } from "../shared/EmptyCard";
import { FavoritesFilters } from "./FavoritesFilters";

type ProfileFavoritesContentProps = {
  favorites: (Recipe | CookingTime)[];
  totalElement: number;
};
export const ProfileFavoritesContent = ({
  favorites,
  totalElement,
}: ProfileFavoritesContentProps) => {
  const navigate = useNavigate();

  const [sort, setSort] = useState("recent");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "recipes",
    "cooking-times",
  ]);

  const allCategories = useMemo(
    () =>
      Array.from(
        new Set(
          favorites
            .flatMap((f) => f?.categories || [])
            .map((c) => c?.name)
            .filter(Boolean),
        ),
      ),
    [favorites],
  );

  const allChefs = useMemo(
    () =>
      Array.from(
        new Set(
          favorites.map((favorite) => favorite.addedBy?._id).filter(Boolean),
        ),
      ),
    [favorites],
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedVisibility, setSelectedVisibility] = useState<string[]>([
    "visible",
    "hidden",
  ]);

  useEffect(() => {
    setSelectedCategories(allCategories);
    setSelectedUsers(allChefs as string[]);
  }, [allCategories, allChefs]);

  const filteredFavorites = useMemo(() => {
    return favorites
      .filter((favorite) => {
        const isRecipe = "ingredients" in favorite;
        const typeMatch = isRecipe
          ? selectedTypes.includes("recipes")
          : selectedTypes.includes("cooking-times");
        return typeMatch;
      })
      .filter(
        (favorite) =>
          favorite?.categories?.some((c) =>
            selectedCategories.includes(c.name),
          ) && selectedUsers.includes(favorite.addedBy?._id ?? ""),
      )
      .filter((cookingTime) =>
        selectedVisibility.includes(cookingTime.visible ? "visible" : "hidden"),
      )
      .sort((a, b) =>
        sort === "recent"
          ? new Date(b.savedAt || b.createdAt).getTime() -
            new Date(a.savedAt || a.createdAt).getTime()
          : new Date(a.savedAt || a.createdAt).getTime() -
            new Date(b.savedAt || b.createdAt).getTime(),
      );
  }, [
    favorites,
    selectedTypes,
    selectedCategories,
    selectedUsers,
    selectedVisibility,
    sort,
  ]);

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
      <FavoritesFilters
        title={totalElement > 1 ? "favoris" : "favori"}
        originalFavorites={favorites}
        totalElement={filteredFavorites.length}
        sort={sort}
        setSort={setSort}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        selectedVisibility={selectedVisibility}
        setSelectedVisibility={setSelectedVisibility}
      />
      {filteredFavorites.map((favorite) =>
        "ingredients" in favorite ? (
          <RecipeCard recipe={favorite as Recipe} key={favorite.slug} />
        ) : (
          <CookingTimeCard
            cookingTime={favorite as CookingTime}
            key={favorite.slug}
          />
        ),
      )}
    </>
  );
};
