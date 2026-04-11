import { useGetAllUsersVisibles } from "@/hooks/users/useGetAllUsersVisibles";
import { UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyCard } from "../recipe-card/EmptyCard";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { UserFilters } from "./UserFilters";

export const UsersContent = () => {
  const { users, totalUsers, isLoading } = useGetAllUsersVisibles();
  const [sort, setSort] = useState("name");
  const navigate = useNavigate();

  const sortedUsers = useMemo(() => {
    const items = [...users].filter((user) => (user.recipeCount ?? 0) > 0);
    if (sort === "recipes") {
      return items.sort(
        (a, b) =>
          (b.recipeCount ?? 0) - (a.recipeCount ?? 0) ||
          a.name.localeCompare(b.name),
      );
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [users, sort]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="justify-between flex items-center">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton className="h-23 w-full rounded-xl" key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (sortedUsers.length === 0) {
    return (
      <div>
        <EmptyCard
          clasName="p-0"
          title="0 chef disponible"
          description="Les autres chefs n'ont pas ajouté de recette."
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <UserFilters
        title={totalUsers > 1 ? "chefs disponibles" : "chef disponible"}
        totalElement={totalUsers}
        sort={sort}
        setSort={setSort}
      />
      <div className="grid grid-cols-3 gap-2">
        {sortedUsers.map((u) => (
          <Link to={`/chef/${u.slug}`}>
            <div className="py-2">
              <Card className="p-0 border-none bg-muted active:brightness-95">
                <CardContent className="items-center flex flex-col p-2 gap-2">
                  <UserRound />
                  <p className="text-center">
                    <span className="font-semibold block">{u.name}</span>
                    <span className="text-foreground/50">
                      {u.recipeCount ?? 0} recette
                      {u.recipeCount && u.recipeCount > 1 ? "s" : ""}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
