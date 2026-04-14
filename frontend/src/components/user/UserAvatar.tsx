import type { User } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type UserAvatarProps = {
  user: User;
  className?: string;
  size?: "sm" | "lg" | "default" | undefined;
  classNameFallback?: string;
};
export function UserAvatar({
  user,
  className,
  size,
  classNameFallback,
}: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback className={classNameFallback}>
        {user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
