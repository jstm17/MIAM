import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useGetAllRecipesVisibles } from "@/hooks/recipes/useGetAllRecipesVisibles";
import { useAuth } from "@/hooks/useAuth";
import { useGetAllUsers } from "@/hooks/users/useGetAllUsers";
import { UserRound, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyCard } from "../recipe-card/EmptyCard";
import { Typography } from "../shared/Typography";
import { Skeleton } from "../ui/skeleton";

const UserCarouselHeader = () => (
  <div className="flex gap-2 px-4 items-center">
    <UsersRound />
    <Typography size="md" weight="semibold">
      Chefs
    </Typography>
  </div>
);

export function UserCarousel() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { users, isLoading: isLoadingUsers } = useGetAllUsers();
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
    .map((u) => ({ ...u, recipesCount: recipesCountByUser[u._id] || 0 }))
    .filter((u) => u.recipesCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (isLoadingAuth || isLoadingUsers || isLoadingRecipes) {
    return (
      <div>
        <UserCarouselHeader />
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
      </div>
    );
  }

  if (sortedUsers.length === 0) {
    return (
      <div>
        <UserCarouselHeader />
        <EmptyCard
          clasName="p-0"
          title="0 chef disponible"
          description="Les autres chefs n'ont pas ajouté de recette."
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
                  <Card className="p-0 bg-secondary ring-0 active:brightness-95">
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
