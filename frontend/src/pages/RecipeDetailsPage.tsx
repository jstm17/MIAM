import { ImageSection } from "@/components/profile/recipe-details/ImageSection";
import { RecipeDetailsSkeleton } from "@/components/profile/recipe-details/skeletons/RecipeDetailsSkeleton";
import { Layout } from "@/components/shared/Layout";
import { Typography } from "@/components/shared/Typography";
import { useGetRecipeById } from "@/hooks/recipes/useGetRecipeById";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

export const RecipeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { recipe, loading } = useGetRecipeById(id!);
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setOffsetY(containerRef.current?.scrollTop ?? 0);
  };

  if (loading) return <RecipeDetailsSkeleton offsetY={offsetY} />;

  return (
    <Layout className="">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-screen no-scrollbar overflow-y-auto"
      >
        <ImageSection recipe={recipe!} offsetY={offsetY} />

        <div className="bg-background rounded-t-4xl -mt-6 relative z-10 p-4 min-h-full">
          <Typography variant="h1" size="lg" weight="semibold">
            {recipe?.name}
          </Typography>
        </div>
      </div>
    </Layout>
  );
};
