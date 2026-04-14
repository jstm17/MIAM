import type { Category } from "@/types/category.types";
import type { Recipe } from "@/types/recipe.types";
import type { RecentSearch } from "@/types/search.types";
import type { User } from "@/types/user.types";
import { normalize } from "@/utils/normalize";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../useAuth";

export const useSearchBar = (
  recipes: Recipe[],
  categories: Category[],
  users: User[],
) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      setOpen(true);
    }
  }, []);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() =>
    JSON.parse(localStorage.getItem("recentSearches") ?? "[]"),
  );
  const { user } = useAuth();

  const q = normalize(query.trim());

  const filteredRecipes = q
    ? recipes.filter((r) => normalize(r.name).includes(q))
    : [];
  const filteredCategories = q
    ? categories.filter((c) => normalize(c.name).includes(q))
    : [];
  const filteredUsers = q
    ? users.filter((u) => normalize(u.name).includes(q))
    : [];
  const hasResults =
    filteredRecipes.length > 0 ||
    filteredCategories.length > 0 ||
    filteredUsers.length > 0;

  const randomSlice = <T>(arr: T[], n: number) =>
    [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  const randomRecipes = useMemo(() => randomSlice(recipes, 5), [recipes]);
  const randomCategories = useMemo(
    () => randomSlice(categories, 5),
    [categories],
  );
  const randomUsers = useMemo(() => randomSlice(users, 5), [users]);

  const saveSearch = (search: RecentSearch) => {
    const updated = [
      search,
      ...recentSearches.filter((s) => s.slug !== search.slug),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const getRecipesCount = (id: string) =>
    recipes.filter((r) => r.categories.some((c) => c._id === id)).length;

  const getUserRecipesCount = (id: string) =>
    recipes.filter((r) => {
      if (r.addedBy?._id !== id) return false;
      if (id === user?._id) return r.visible;
      return r;
    }).length;

  const handleRecipeSelect = (recipe: Recipe) => {
    saveSearch({
      label: recipe.name,
      type: "recipe",
      slug: recipe.slug,
      addedBy: recipe.addedBy?.name,
    });
    navigate(`/recipe/${recipe.slug}`);
    setQuery("");
    setOpen(false);
  };

  const handleCategorySelect = (category: Category) => {
    const recipesCount = getRecipesCount(category._id);
    saveSearch({
      label: category.name,
      type: "category",
      slug: category.slug,
      recipesCount,
    });
    navigate(`/category/${category.slug}`);
    setQuery("");
    setOpen(false);
  };

  const handleUserSelect = (user: User) => {
    const recipesCount = getUserRecipesCount(user._id);
    saveSearch({
      label: user.name,
      type: "user",
      slug: user.slug,
      recipesCount,
    });
    navigate(`/chef/${user.slug}`);
    setQuery("");
    setOpen(false);
  };

  const handleRecentSelect = (search: RecentSearch) => {
    navigate(
      search.type === "recipe"
        ? `/recipe/${search.slug}`
        : search.type === "category"
          ? `/category/${search.slug}`
          : `/chef/${search.slug}`,
    );
    setOpen(false);
  };
  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && !query) {
      setSearchParams({});
    }
  };

  return {
    query,
    setQuery,
    open,
    setOpen,
    filteredRecipes,
    filteredCategories,
    filteredUsers,
    hasResults,
    randomRecipes,
    randomCategories,
    randomUsers,
    recentSearches,
    getRecipesCount,
    getUserRecipesCount,
    handleRecipeSelect,
    handleCategorySelect,
    handleUserSelect,
    handleRecentSelect,
    handleQueryChange,
    handleClose,
    setRecentSearches,
  };
};
