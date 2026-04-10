import { useQuery } from "@tanstack/react-query";
import { recipeService } from "../../services/recipeService";
import type { Recipe } from "../../types/recipe.types";

export const useGetRecipeBySlug = (slug: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe", "slug", slug],
    queryFn: () =>
      recipeService.getBySlug(slug).then((res) => res.data.data as Recipe),
    enabled: !!slug,
    staleTime: 0,
  });

  return { recipe: data ?? null, isLoading, error };
};
