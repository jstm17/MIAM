import { HomeContent } from "@/components/home/HomeContent";
import { HomeHeader } from "@/components/home/HomeHeader";
import { Layout } from "../components/shared/Layout";

export const HomePage = () => {
  return (
    <Layout>
      <HomeHeader />
      <HomeContent />
    </Layout>
  );
};
