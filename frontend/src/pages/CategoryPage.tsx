import { CategoryCookingTimeContent } from "@/components/category/CategoryCookingTimeContent";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { CategoryRecipeContent } from "@/components/category/CategoryRecipeContent";
import { EmptyCard } from "@/components/shared/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCategoryBySlug } from "@/hooks/categories/useGetCategoryBySlug";
import { Timer, UtensilsCrossed } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { category, isLoading, isFetching } = useGetCategoryBySlug(slug!);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const defaultTab =
    searchParams.get("tab") === "cooking-time" ? "cooking-time" : "recipe";

  if (isLoading || isFetching) return <Loading />;

  if (!category) {
    return (
      <Layout
        header
        className="items-center pt-4 pb-[calc(env(safe-area-inset-bottom)+48px)]"
      >
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
    <Layout className="items-center pt-4 pb-[calc(env(safe-area-inset-bottom)+58px)]">
      <CategoryHeader category={category} />
      <Tabs
        defaultValue={defaultTab}
        onValueChange={(val) => {
          if (val === "cooking-time") {
            setSearchParams({ tab: "cooking-time" });
          } else {
            setSearchParams({});
          }
        }}
        className="relative mr-auto w-full flex flex-col mt-2"
      >
        <TabsList className="w-full justify-start rounded-none border-b p-0 sticky top-0 z-40 bg-background">
          <TabsTrigger
            value="recipe"
            className="group select-none touch-manipulation relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none "
          >
            <UtensilsCrossed className="size-5 stroke-current text-muted-foreground group-data-[state=active]:text-foreground" />
          </TabsTrigger>
          <TabsTrigger
            value="cooking-time"
            className="group select-none touch-manipulation overflow-hidden whitespace-nowrap text-ellipsis relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none "
          >
            <Timer className="size-5 stroke-current text-muted-foreground group-data-[state=active]:text-foreground" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recipe" className="p-4">
          <CategoryRecipeContent category={category} />
        </TabsContent>
        <TabsContent value="cooking-time" className="p-4">
          <CategoryCookingTimeContent category={category} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};
