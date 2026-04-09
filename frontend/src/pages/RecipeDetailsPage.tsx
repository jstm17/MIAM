import { RecipeDetailsImage } from "@/components/recipe-details/RecipeDetailsImage";
import { RecipeDetailsSkeleton } from "@/components/recipe-details/skeletons/RecipeDetailsSkeleton";
import { Layout } from "@/components/shared/Layout";

import { useGetRecipeBySlug } from "@/hooks/recipes/useGetRecipeBySlug";

import { RecipeDetailsContent } from "@/components/recipe-details/RecipeDetailsContent";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "./NotFoundPage";

export const RecipeDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { recipe, isLoading } = useGetRecipeBySlug(slug!);
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    setOffsetY(containerRef.current?.scrollTop ?? 0);
  };

  if (isLoading) return <RecipeDetailsSkeleton offsetY={offsetY} />;

  if (!recipe)
    return (
      <NotFoundPage
        title="Recette non trouvée"
        description="Désolée, la recette que vous cherchez n'existe pas."
        buttonText={"Retour"}
        buttonLink={-1}
      />
    );

  return (
    <Layout className="">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-screen no-scrollbar overflow-y-auto"
      >
        <RecipeDetailsImage recipe={recipe} offsetY={offsetY} />
        <RecipeDetailsContent recipe={recipe} />
      </div>
      ;
    </Layout>
  );
};
