import { type ReactNode } from "react";
import { BottomNav } from "./BottomNav";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  titleSize?: string;
  className?: string;
  navBar?: boolean;
};
export const Layout = ({
  children,
  title,
  titleSize = "3xl",
  className = "p-4 pb-18",
  navBar = true,
}: LayoutProps) => {
  return (
    <>
      <main
        className={`w-screen min-h-screen flex flex-col max-w-lg mx-auto ${className}`}
      >
        {title && (
          <h1 className={`text-${titleSize} font-bold mb-4`}>{title}</h1>
        )}
        {children}
      </main>
      {navBar && <BottomNav />}
    </>
  );
};
