import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useGetAllCookingTimesVisibles } from "@/hooks/cooking-times/useGetAllCookingTimesVisibles";
import { useAuth } from "@/hooks/useAuth";
import { useGetTopAllUsersCookingTime } from "@/hooks/users/useGetTopAllUsersCookingTime";
import { ChevronRight, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyCard } from "../shared/EmptyCard";
import { Typography } from "../shared/Typography";
import { Skeleton } from "../ui/skeleton";
import { UserCardCookingTime } from "../user/UserCardCookingTime";

const UserCarouselCookingTimeHeader = () => (
  <div className="flex gap-2 px-4 items-center justify-between mb-1">
    <div className="flex gap-2 items-center">
      <UsersRound />
      <Typography size="md" weight="bold">
        Chefs
      </Typography>
    </div>
    <Link to="/chefs?tab=cooking-time" className="flex gap-1 items-center">
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

export function UserCarouselCookingTime() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { users, isLoading: isLoadingUsers } = useGetTopAllUsersCookingTime();

  const { cookingTimes, isLoading: isLoadingCookingTimes } =
    useGetAllCookingTimesVisibles();

  const cookingTimesCountByUser = (cookingTimes ?? []).reduce<
    Record<string, number>
  >((acc, cookingTime) => {
    const userId = cookingTime.addedBy?._id;
    if (!userId) return acc;
    acc[userId] = (acc[userId] || 0) + 1;
    return acc;
  }, {});

  const sortedUsers = (users ?? [])
    .filter((u) => u._id !== user?._id)
    .map((u) => ({
      ...u,
      cookingTimesCount:
        cookingTimesCountByUser[u._id] || u.cookingTimesCount || 0,
    }))
    .filter((u) => u.cookingTimesCount > 0);

  if (isLoadingAuth || isLoadingUsers || isLoadingCookingTimes) {
    return (
      <div>
        <UserCarouselCookingTimeHeader />
        <Carousel opts={{ align: "start" }} className="w-[110%]">
          <CarouselContent>
            {Array.from({ length: 4 }).map((_, i) => (
              <CarouselItem key={i} className="basis-1/3">
                <div className="py-2">
                  <Card className="p-0 bg-muted ring-0">
                    <Skeleton className="h-[118px]" />
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
        <UserCarouselCookingTimeHeader />
        <EmptyCard
          title="0 chef disponible"
          description="Les autres chefs n'ont pas ajouté de temps de cuisson."
          className="bg-muted m-4 p-0 pt-4 w-[100wh]"
          iconClassName="bg-muted-foreground/10"
        />
      </div>
    );
  }

  return (
    <div>
      <UserCarouselCookingTimeHeader />
      <Carousel opts={{ align: "start" }} className="w-[110%] mt-2">
        <CarouselContent>
          {sortedUsers.map((u) => (
            <CarouselItem key={u._id} className="basis-1/3">
              <Link to={`/chef/${u.slug}?tab=cooking-time`}>
                <UserCardCookingTime user={u} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
