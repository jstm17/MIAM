import type { Recipe } from "@/types/recipe.types";
import { Carrot } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyCard } from "../recipe-card/EmptyCard";
import { RecipeCard } from "../recipe-card/RecipeCard";
import { Typography } from "../shared/Typography";
import { Card } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

type IngredientCarouselProps = {
  selectedIngredients: string[];
  filteredRecipes: Recipe[];
  isLoading: boolean;
};
export const IngredientCarousel = ({
  selectedIngredients,
  filteredRecipes,
  isLoading,
}: IngredientCarouselProps) => {
  if (isLoading) {
    return (
      <Carousel opts={{ align: "start" }} className="w-[110%]">
        <CarouselContent>
          {Array.from({ length: 4 }).map((_, i) => (
            <CarouselItem key={i} className="basis-1/3">
              <div className="py-2">
                <Card className="p-0 bg-secondary ring-0">
                  <Skeleton className="h-21" />
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    );
  }
  if (selectedIngredients.length === 0) {
    return (
      <div className="mt-4">
        <EmptyCard
          clasName="p-0"
          title="Aucun ingrédient sélectionné"
          description="Sélectionnez au moins un ingrédient pour afficher les recettes."
          icon={<Carrot size={48} />}
        />
      </div>
    );
  }
  if (filteredRecipes.length === 0) {
    return (
      <div className="mt-4">
        <EmptyCard
          clasName="p-0"
          title="0 recette trouvée"
          description="Aucune recette trouvée avec ces ingrédients"
        />
      </div>
    );
  }
  return (
    <div className="mt-2">
      <Typography size="sm" className="px-4 text-muted-foreground mb-2">
        {filteredRecipes.length} recette{filteredRecipes.length > 1 ? "s" : ""}{" "}
        contenant{" "}
        {selectedIngredients.length > 1 ? "ces ingrédients" : "cet ingrédient"}{" "}
        :
      </Typography>
      {selectedIngredients.length === 0 ? (
        <Typography size="sm" className="text-muted-foreground">
          Sélectionnez au moins un ingrédient pour afficher les recettes.
        </Typography>
      ) : filteredRecipes.length === 0 ? (
        <Typography size="sm" className="text-muted-foreground">
          Aucune recette ne correspond à ces ingrédients.
        </Typography>
      ) : (
        <Carousel opts={{ align: "start" }} className="w-[110%]">
          <CarouselContent>
            {filteredRecipes.map((recipe) => (
              <CarouselItem key={recipe._id} className="basis-2/3">
                <Link to={`/recipe/${recipe.slug}`} key={recipe._id}>
                  <RecipeCard recipe={recipe} />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
};
