import miamLogo from "@/assets/miam-logo.svg";
import { type ReactNode } from "react";
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
  className = "p-4 pb-[calc(74px+env(safe-area-inset-bottom))]",
  navBar = true,
  header = false,
}: LayoutProps) => {
  return (
    <>
      {header && (
        <header className="flex justify-center px-4 pt-6">
          <img src={miamLogo} alt="Miam logo" className="h-6" />
        </header>
      )}

      <main
        className={`w-screen flex flex-col max-w-lg mx-auto ${className} gap-4`}
        style={{
          minHeight: `calc(100dvh - 58px - env(safe-area-inset-bottom)${header ? " - 54px" : ""})`,
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
      {navBar && <BottomNav />}
    </>
  );
};
