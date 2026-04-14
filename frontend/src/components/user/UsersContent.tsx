import { useAuth } from "@/hooks/useAuth";
import { useGetAllUsersVisibles } from "@/hooks/users/useGetAllUsersVisibles";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyCard } from "../recipe-card/EmptyCard";
import { Skeleton } from "../ui/skeleton";
import { UserCard } from "./UserCard";
import { UserFilters } from "./UserFilters";

export const UsersContent = () => {
  const { users, isLoading } = useGetAllUsersVisibles();
  const { user: authUser } = useAuth();
  const [sort, setSort] = useState("name");

  const filteredUsers = useMemo(
    () => users.filter((user) => user._id !== authUser?._id),
    [users, authUser?._id],
  );

  const sortedUsers = useMemo(() => {
    const items = [...filteredUsers].filter(
      (user) => (user.recipesCount ?? 0) > 0,
    );
    if (sort === "recipes") {
      return items.sort(
        (a, b) =>
          (b.recipesCount ?? 0) - (a.recipesCount ?? 0) ||
          a.name.localeCompare(b.name),
      );
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredUsers, sort]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="justify-between flex items-center">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton className="h-[118px] w-full rounded-xl" key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (sortedUsers.length === 0) {
    return (
      <div>
        <EmptyCard
          className="p-0"
          title="0 chef disponible"
          description="Les autres chefs n'ont pas ajouté de recette."
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <UserFilters
        title={
          filteredUsers.length > 1 ? "chefs disponibles" : "chef disponible"
        }
        totalElement={filteredUsers.length}
        sort={sort}
        setSort={setSort}
      />
      <div className="grid grid-cols-2 gap-2">
        {sortedUsers.map((u) => (
          <Link to={`/chef/${u.slug}`}>
            <UserCard user={u} />
          </Link>
        ))}
      </div>
    </div>
  );
};
