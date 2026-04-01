import { type ReactNode } from "react";
import { Header } from "./Header";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  className?: string;
  noHeader?: boolean;
};
export const Layout = ({
  children,
  title,
  className,
  noHeader,
}: LayoutProps) => {
  return (
    <div className="w-screen min-h-screen flex flex-col">
      {!noHeader && <Header />}
      <main
        className={`flex flex-col items-center justify-center p-8 ${className}`}
      >
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        {children}
      </main>
    </div>
  );
};
