import { CookingTimeDetailsImage } from "@/components/cooking-time-details/CookingTimeDetailsImage";
import { CookingTimeDetailsSkeleton } from "@/components/cooking-time-details/skeletons/CookingTimeDetailsSkeleton";
import { Layout } from "@/components/shared/Layout";

import { CookingTimeDetailsContent } from "@/components/cooking-time-details/CookingTimeDetailsContent";
import { useGetCookingTimeBySlug } from "@/hooks/cooking-times/useGetCookingTimeBySlug";
import { useAuth } from "@/hooks/useAuth";
import { useScroll, useTransform } from "framer-motion";
import { EyeOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "./NotFoundPage";

export const CookingTimeDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { cookingTime, isLoading } = useGetCookingTimeBySlug(slug!);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  if (isLoading || isLoadingAuth) return <CookingTimeDetailsSkeleton />;

  if (!cookingTime)
    return (
      <NotFoundPage
        title="Temps de cuisson non trouvé"
        description="Désolé, le temps de cuisson que vous cherchez n'existe pas."
        buttonText={"Retour"}
        buttonLink={-1}
      />
    );

  if (cookingTime.visible == false && cookingTime.addedBy._id !== user?._id)
    return (
      <NotFoundPage
        icon={<EyeOff />}
        title="Temps de cuisson privé"
        description={`Désolé, ${cookingTime.addedBy.name} a rendu ce temps de cuisson privée.`}
        buttonText={"Retour"}
        buttonLink={-1}
      />
    );

  return (
    <Layout className="">
      <div ref={containerRef} className="h-1/2 no-scrollbar overflow-y-auto">
        <CookingTimeDetailsImage cookingTime={cookingTime} y={y} />
      </div>
      <CookingTimeDetailsContent cookingTime={cookingTime} />
    </Layout>
  );
};
