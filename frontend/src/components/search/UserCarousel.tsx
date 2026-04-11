import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useGetAllRecipesVisibles } from "@/hooks/recipes/useGetAllRecipesVisibles";
import { useAuth } from "@/hooks/useAuth";
import { useGetTopAllUsers } from "@/hooks/users/useGetTopAllUsers";
import { ChevronRight, UserRound, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyCard } from "../recipe-card/EmptyCard";
import { Typography } from "../shared/Typography";
import { Skeleton } from "../ui/skeleton";

const UserCarouselHeader = () => (
  <div className="flex gap-2 px-4 items-center justify-between mb-1">
    <div className="flex gap-2 items-center">
      <UsersRound />
      <Typography size="md" weight="bold">
        Chefs
      </Typography>
    </div>
    <Link to="/chefs" className="flex gap-1 items-center">
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

export function UserCarousel() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { users, isLoading: isLoadingUsers } = useGetTopAllUsers();
  const { recipes, isLoading: isLoadingRecipes } = useGetAllRecipesVisibles();

  const recipesCountByUser = (recipes ?? []).reduce<Record<string, number>>(
    (acc, recipe) => {
      const userId = recipe.addedBy?._id;
      if (!userId) return acc;
      acc[userId] = (acc[userId] || 0) + 1;
      return acc;
    },
    {},
  );

  const sortedUsers = (users ?? [])
    .filter((u) => u._id !== user?._id)
    .map((u) => ({
      ...u,
      recipesCount: recipesCountByUser[u._id] || u.recipeCount || 0,
    }))
    .filter((u) => u.recipesCount > 0);

  if (isLoadingAuth || isLoadingUsers || isLoadingRecipes) {
    return (
      <div>
        <UserCarouselHeader />
        <Carousel opts={{ align: "start" }} className="w-[110%]">
          <CarouselContent>
            {Array.from({ length: 4 }).map((_, i) => (
              <CarouselItem key={i} className="basis-1/3">
                <div className="py-2">
                  <Card className="p-0 bg-muted ring-0">
                    <Skeleton className="h-21" />
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  if (sortedUsers.length === 0) {
    return (
      <div>
        <UserCarouselHeader />
        <EmptyCard
          title="0 chef disponible"
          description="Les autres chefs n'ont pas ajouté de recette."
          className="bg-muted m-4 p-0 pt-4 w-[100wh]"
          iconClassName="bg-muted-foreground/10"
        />
      </div>
    );
  }

  return (
    <div>
      <UserCarouselHeader />
      <Carousel opts={{ align: "start" }} className="w-[110%]">
        <CarouselContent>
          {sortedUsers.map((u) => (
            <CarouselItem key={u._id} className="basis-1/3">
              <Link to={`/chef/${u.slug}`}>
                <div className="py-2">
                  <Card className="p-0 border-none bg-muted active:brightness-95">
                    <CardContent className="items-center flex flex-col p-2 gap-2">
                      <UserRound />
                      <p className="text-center">
                        <span className="font-semibold block">{u.name}</span>
                        <span className="text-foreground/50">
                          {u.recipesCount} recette
                          {u.recipesCount > 1 ? "s" : ""}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
