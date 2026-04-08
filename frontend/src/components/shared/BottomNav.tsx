import { cn } from "@/lib/utils";
import { Home, Plus, Search, ShoppingBasket, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", icon: Home },
  { to: "/search", icon: Search },
  { to: "/recipe-add", icon: Plus },
  { to: "/shopping-list", icon: ShoppingBasket },
  { to: "/profile", icon: UserRound },
];

export const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="w-full bg-white z-30 border-t px-4 py-2 flex justify-between fixed bottom-0 items-center max-w-lg inset-x-0 mx-auto">
      {navLinks.map(({ to, icon: Icon }) => (
        <Link key={to} to={to}>
          {Icon == Plus ? (
            <div
              className={cn(
                "bg-primary rounded-[min(var(--radius-2xl),10px)] p-2 text-white",
              )}
            >
              <Plus />
            </div>
          ) : (
            <Icon
              className={cn(
                "text-muted-foreground",
                pathname === to && "text-primary",
              )}
            />
          )}
        </Link>
      ))}
    </nav>
  );
};
