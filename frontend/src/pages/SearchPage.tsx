import { CategoryCarousel } from "@/components/search/CategoryCarousel";
import { SearchInput } from "@/components/search/SearchInput";
import { UserCarousel } from "@/components/search/UserCarousel";
import { Layout } from "@/components/shared/Layout";

export const SearchPage = () => {
  return (
    <Layout className="overflow-x-hidden gap-2">
      <SearchInput />
      <CategoryCarousel />
      <UserCarousel />
    </Layout>
  );
};
