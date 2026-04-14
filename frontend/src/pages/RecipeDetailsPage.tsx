import { RecipeDetailsImage } from "@/components/recipe-details/RecipeDetailsImage";
import { RecipeDetailsSkeleton } from "@/components/recipe-details/skeletons/RecipeDetailsSkeleton";
import { Layout } from "@/components/shared/Layout";

import { useGetRecipeBySlug } from "@/hooks/recipes/useGetRecipeBySlug";

import { RecipeDetailsContent } from "@/components/recipe-details/RecipeDetailsContent";
import { useAuth } from "@/hooks/useAuth";
import { useScroll, useTransform } from "framer-motion";
import { EyeOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "./NotFoundPage";

export const RecipeDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { recipe, isLoading } = useGetRecipeBySlug(slug!);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  if (isLoading || isLoadingAuth) return <RecipeDetailsSkeleton />;

  if (!recipe)
    return (
      <NotFoundPage
        title="Recette non trouvée"
        description="Désolé, la recette que vous cherchez n'existe pas."
        buttonText={"Retour"}
        buttonLink={-1}
      />
    );

  if (recipe.visible == false && recipe.addedBy._id !== user?._id)
    return (
      <NotFoundPage
        icon={<EyeOff />}
        title="Recette masquée"
        description={`Désolé, ${recipe.addedBy.name} a masqué cette recette.`}
        buttonText={"Retour"}
        buttonLink={-1}
      />
    );

  return (
    <Layout className="">
      <div ref={containerRef} className="h-1/2 no-scrollbar overflow-y-auto">
        <RecipeDetailsImage recipe={recipe} y={y} />
      </div>
      <RecipeDetailsContent recipe={recipe} />
    </Layout>
  );
};
