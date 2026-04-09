import { CategoryContent } from "@/components/category/CategoryContent";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { EmptyCard } from "@/components/recipe-card/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { useGetCategoryBySlug } from "@/hooks/categories/useGetCategoryBySlug";
import { useNavigate, useParams } from "react-router-dom";

export const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { category, isLoading } = useGetCategoryBySlug(slug!);
  const navigate = useNavigate();

  if (isLoading) return <Loading />;

  if (!category) {
    return (
      <Layout>
        <EmptyCard
          title="Catégorie non trouvée"
          description="Cette catégorie n'existe pas."
          buttonText="Retour"
          onButtonClick={() => navigate(-1)}
        />
      </Layout>
    );
  }
  return (
    <Layout>
      <CategoryHeader category={category} />
      <CategoryContent category={category} />
    </Layout>
  );
};
