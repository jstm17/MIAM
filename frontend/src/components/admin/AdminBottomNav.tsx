import { cn } from "@/lib/utils";
import { Carrot, Home, Timer, UsersRound, UtensilsCrossed } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/admin", icon: Home },
  { to: "/admin/users", icon: UsersRound },
  { to: "/admin/recipes", icon: UtensilsCrossed },
  { to: "/admin/cooking-times", icon: Timer },
  { to: "/admin/ingredients", icon: Carrot },
];

export const AdminBottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="w-full bg-background z-30 border-t px-7 py-3 flex justify-between fixed bottom-[calc(env(safe-area-inset-bottom)+58px)] items-center max-w-lg inset-x-0 mx-auto ">
      {navLinks.map(({ to, icon: Icon }) => (
        <Link key={to} to={to}>
          <Icon
            className={cn(
              "text-muted-foreground active:text-foreground",
              pathname === to && "text-primary",
            )}
          />
        </Link>
      ))}
    </nav>
  );
};
