import type { User } from "@/types/user.types";
import { Card, CardContent } from "../ui/card";
import { UserAvatar } from "./UserAvatar";

type UserCardProps = {
  user: User;
};
export const UserCardCookingTime = ({ user }: UserCardProps) => {
  return (
    <Card className="py-4 px-2 border-none bg-muted active:brightness-95">
      <CardContent className="items-center flex flex-col gap-2 p-0">
        <UserAvatar user={user} />
        <p className="text-center">
          <span className="font-semibold block">{user.name}</span>
          <span className="text-foreground/50">
            {user.cookingTimesCount} TdC
            {user.cookingTimesCount && user.cookingTimesCount > 1 ? "s" : ""}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
