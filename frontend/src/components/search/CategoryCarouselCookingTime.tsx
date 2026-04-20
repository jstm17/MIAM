import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useGetTopCategoriesVisiblesCookingTimes } from "@/hooks/categories/useGetTopCategoriesVisiblesCookingTime";
import { ChevronRight, Tags } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyCard } from "../shared/EmptyCard";
import { Typography } from "../shared/Typography";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";

const CategoryCarouselCookingTimeHeader = () => (
  <div className="flex gap-2 px-4 items-center justify-between mb-1">
    <div className="flex gap-2 items-center">
      <Tags />
      <Typography size="md" weight="bold">
        Catégories
      </Typography>
    </div>
    <Link to="/categories?tab=cooking-time" className="flex gap-1 items-center">
      <Typography
        size="sm"
        variant="body"
        className="text-secondary-foreground/80"
      >
        Tout voir
      </Typography>
      <ChevronRight size={16} className="text-secondary-foreground/80" />
    </Link>
  </div>
);

export function CategoryCarouselCookingTime() {
  const navigate = useNavigate();
  const { categories, isLoading } = useGetTopCategoriesVisiblesCookingTimes();

  if (isLoading) {
    return (
      <>
        <CategoryCarouselCookingTimeHeader />
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
      </>
    );
  }

  if (categories.length === 0) {
    return (
      <div>
        <CategoryCarouselCookingTimeHeader />
        <EmptyCard
          className="bg-muted m-4 p-2 py-4 w-[100wh]"
          iconClassName="bg-muted-foreground/10"
          title="0 catégorie disponible"
          description="Personne n'a ajouté de temps de cuisson."
          buttonText="Ajouter une temps de cuisson"
          onButtonClick={() => navigate("/add")}
        />
      </div>
    );
  }

  return (
    <div>
      <CategoryCarouselCookingTimeHeader />
      <Carousel opts={{ align: "start" }} className="w-[110%]">
        <CarouselContent>
          {categories.map((cat) => (
            <CarouselItem
              key={cat._id}
              className="basis-1/3 max-w-full overflow-hidden whitespace-nowrap text-ellipsis"
            >
              <Link to={`/category/${cat.slug}?tab=cooking-time`}>
                <div className="py-2 ">
                  <Card className="p-0 active:brightness-95">
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
                    className="text-center truncate"
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
