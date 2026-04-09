import { type ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Typography } from "./Typography";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  titleSize?: "lg" | "sm" | "md" | undefined;
  className?: string;
  navBar?: boolean;
};
export const Layout = ({
  children,
  title,
  titleSize = "lg",
  className = "p-4 pb-[calc(74px+env(safe-area-inset-bottom))]",
  navBar = true,
}: LayoutProps) => {
  return (
    <>
      <main
        className={`w-screen min-h-[calc(100dvh-58px-env(safe-area-inset-bottom))] flex flex-col max-w-lg mx-auto ${className} gap-4`}
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
