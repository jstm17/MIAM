import { useGetAllCategoriesVisiblesCookingTime } from "@/hooks/categories/useGetAllCategoriesVisiblesCookingTime";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyCard } from "../shared/EmptyCard";
import { Typography } from "../shared/Typography";
import { AspectRatio } from "../ui/aspect-ratio";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { CategoryFilters } from "./CategoryFilters";

export const CategoriesCookingTimeContent = () => {
  const navigate = useNavigate();

  const { categories, totalCategories, isLoading } =
    useGetAllCategoriesVisiblesCookingTime();
  const [sort, setSort] = useState("name");

  const sortedCategories = useMemo(() => {
    const items = [...categories];
    if (sort === "cookingTimes") {
      return items
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort(
          (a, b) => (b.cookingTimesCount ?? 0) - (a.cookingTimesCount ?? 0),
        );
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, sort]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="justify-between flex items-center">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <AspectRatio ratio={1} key={i}>
              <Skeleton className="h-full w-full rounded-xl" />
            </AspectRatio>
          ))}
        </div>
      </div>
    );
  }

  if (sortedCategories.length === 0) {
    return (
      <div>
        <EmptyCard
          title="0 catégorie disponible"
          description="Personne n'a ajouté de temps de cuisson."
          buttonText="Ajouter un temps de cuisson"
          onButtonClick={() => navigate("/add?tab=cooking-time")}
        />
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <CategoryFilters
        title={
          totalCategories > 1
            ? "catégories disponibles"
            : "catégorie disponible"
        }
        totalElement={totalCategories}
        sort={sort}
        setSort={setSort}
      />
      <div className="grid grid-cols-3 gap-2">
        {sortedCategories.map((cat) => (
          <Link to={`/category/${cat.slug}?tab=cooking-time`} key={cat._id}>
            <div>
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
        ))}
      </div>
    </div>
  );
};
