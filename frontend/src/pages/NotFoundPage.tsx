import type { ReactNode } from "react";
import { Layout } from "../components/shared/Layout";

type NotFoundPageProps = {
  children?: ReactNode;
};
export const NotFoundPage = ({ children }: NotFoundPageProps) => {
  return (
    <Layout title="Oups..." className="min-h-[50vh] text-xl">
      {children || "Page non trouvée"}
    </Layout>
  );
};
