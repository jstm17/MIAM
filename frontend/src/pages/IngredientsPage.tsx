import { IngredientsContent } from "@/components/ingredient/IngredientsContent";
import { IngredientsHeader } from "@/components/ingredient/IngredientsHeader";
import { Layout } from "@/components/shared/Layout";

const IngredientsPage = () => {
  return (
    <Layout>
      <IngredientsHeader />
      <IngredientsContent />
    </Layout>
  );
};

export default IngredientsPage;
