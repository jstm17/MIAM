import { CategoryCarousel } from "@/components/search/CategoryCarousel";
import { IngredientSection } from "@/components/search/IngredientSection";
import { UserCarousel } from "@/components/search/UserCarousel";

export const SearchRecipeContent = () => {
  return (
    <>
      <CategoryCarousel />
      <UserCarousel />
      <IngredientSection />
    </>
  );
};
