import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Home, Plus, Search, ShoppingBasket, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { UserAvatar } from "../user/UserAvatar";

const navLinks = [
  { to: "/", icon: Home },
  { to: "/search", icon: Search },
  { to: "/recipe-add", icon: Plus },
  { to: "/shopping-list", icon: ShoppingBasket },
  { to: "/profile", icon: UserRound },
];

export const BottomNav = () => {
  const { pathname } = useLocation();
  const { user, isLoading } = useAuth();
  return (
    <nav className="w-full bg-background z-30 border-t px-7 pt-2 flex justify-between fixed bottom-0 items-center max-w-lg inset-x-0 mx-auto pb-[calc(env(safe-area-inset-bottom)+8px)]">
      {navLinks.map(({ to, icon: Icon }) => (
        <Link key={to} to={to}>
          {Icon == Plus ? (
            <div
              className={cn(
                "bg-primary rounded-[min(var(--radius-2xl),12px)] p-2 text-white active:brightness-95",
              )}
            >
              <Plus />
            </div>
          ) : Icon == UserRound ? (
            !isLoading ? (
              user ? (
                <UserAvatar
                  user={user}
                  size="sm"
                  className={cn(
                    "text-muted-foreground active:text-foreground",
                    pathname === to && "ring-2 ring-primary!",
                  )}
                  classNameFallback={cn(pathname === to && "border-0!")}
                />
              ) : (
                <UserRound
                  className={cn(
                    "text-muted-foreground active:text-foreground",
                    pathname === to && "text-primary",
                  )}
                />
              )
            ) : (
              <Skeleton className="h-6 w-6 rounded-full border-input" />
            )
          ) : (
            <Icon
              className={cn(
                "text-muted-foreground active:text-foreground",
                pathname === to && "text-primary",
              )}
            />
          )}
        </Link>
      ))}
    </nav>
  );
};
