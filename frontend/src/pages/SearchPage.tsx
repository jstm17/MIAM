import { CategoryCarousel } from "@/components/search/CategoryCarousel";
import { IngredientSection } from "@/components/search/IngredientSection";
import { SearchBar } from "@/components/search/SearchInput";
import { UserCarousel } from "@/components/search/UserCarousel";
import { Layout } from "@/components/shared/Layout";

export const SearchPage = () => {
  return (
    <Layout className="overflow-x-hidden gap-2 pb-[calc(74px+env(safe-area-inset-bottom))]">
      <SearchBar />
      <CategoryCarousel />
      <UserCarousel />
      <IngredientSection />
    </Layout>
  );
};
