import miamLogo from "@/assets/miam-logo.svg";
import { useAuth } from "@/hooks/useAuth";
import { type ReactNode } from "react";
import { AdminBottomNav } from "../admin/AdminBottomNav";
import { BottomNav } from "./BottomNav";
import { Typography } from "./Typography";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  titleSize?: "lg" | "sm" | "md" | undefined;
  className?: string;
  navBar?: boolean;
  header?: boolean;
};
export const Layout = ({
  children,
  title,
  titleSize = "lg",
  className = "p-4 pb-[calc(78px+env(safe-area-inset-bottom))]",
  navBar = true,
  header = false,
}: LayoutProps) => {
  const { user } = useAuth();

  const isAdmin = user && user.role === "admin";

  return (
    <>
      {header && (
        <header className="flex justify-center px-4 pt-6">
          <img src={miamLogo} alt="Miam logo" className="h-6" />
        </header>
      )}

      <main
        className={`flex flex-col max-w-lg mx-auto ${className} gap-4`}
        style={{
          minHeight: `calc(100dvh - 58px - env(safe-area-inset-bottom)${header ? " - 54px" : ""})`,
          ...(isAdmin && {
            paddingBottom: `calc(108px + env(safe-area-inset-bottom))`,
          }),
        }}
      >
        {title && (
          <Typography
            variant="h1"
            size={titleSize}
            weight="bold"
            className="text-center"
          >
            {title}
          </Typography>
        )}
        {children}
      </main>
      {isAdmin && <AdminBottomNav />}
      {navBar && <BottomNav />}
    </>
  );
};
