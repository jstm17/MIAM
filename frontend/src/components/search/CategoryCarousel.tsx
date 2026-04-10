import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useGetAllCategories } from "@/hooks/categories/useGetAllCategories";
import { Tags } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyCard } from "../recipe-card/EmptyCard";
import { Typography } from "../shared/Typography";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";

const CategoryCarouselHeader = () => (
  <div className="flex gap-2 px-4 items-center">
    <Tags />
    <Typography size="md" weight="semibold">
      Catégories
    </Typography>
  </div>
);

export function CategoryCarousel() {
  const navigate = useNavigate();
  const { categories, isLoading } = useGetAllCategories();

  const sortedCategories = (categories ?? []).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  if (isLoading) {
    return (
      <div>
        <CategoryCarouselHeader />
        <Carousel opts={{ align: "start" }} className="w-[110%]">
          <CarouselContent>
            {Array.from({ length: 4 }).map((_, i) => (
              <CarouselItem key={i} className="basis-1/3">
                <div className="py-2">
                  <Card className="p-0 ring-0">
                    <AspectRatio ratio={1}>
                      <Skeleton className="h-full w-full" />
                    </AspectRatio>
                  </Card>
                  <Skeleton className="h-4 w-2/3 m-auto mt-4" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  if (sortedCategories.length === 0) {
    return (
      <div>
        <CategoryCarouselHeader />
        <EmptyCard
          clasName="p-0"
          title="0 catégorie disponible"
          description="Personne n'a ajouté de recette."
          buttonText="Ajouter une recette"
          onButtonClick={() => navigate("/recipe-add")}
        />
      </div>
    );
  }

  return (
    <div>
      <CategoryCarouselHeader />
      <Carousel opts={{ align: "start" }} className="w-[110%]">
        <CarouselContent>
          {sortedCategories.map((cat) => (
            <CarouselItem key={cat._id} className="basis-1/3">
              <Link to={`/category/${cat.slug}`}>
                <div className="py-2">
                  <Card className="p-0">
                    <AspectRatio ratio={1}>
                      {cat.image ? (
                        <img
                          src={cat.image}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Skeleton className="h-full w-full" />
                      )}
                    </AspectRatio>
                  </Card>
                  <Typography
                    weight="semibold"
                    size="sm"
                    className="text-center"
                  >
                    {cat.name}
                  </Typography>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
