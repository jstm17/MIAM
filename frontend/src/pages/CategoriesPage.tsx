import { CategoriesContent } from "@/components/category/CategoriesContent";
import { CategoriesHeader } from "@/components/category/CategoriesHeader";
import { Layout } from "@/components/shared/Layout";

export const CategoriesPage = () => {
  return (
    <Layout>
      <CategoriesHeader />
      <CategoriesContent />
    </Layout>
  );
};
