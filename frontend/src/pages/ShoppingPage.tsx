import { EmptyCard } from "@/components/recipe-card/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { ShoppingContent } from "@/components/shopping/ShoppingContent";
import { ShoppingHeader } from "@/components/shopping/ShoppingHeader";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ShoppingPage = () => {
  const { user, isLoading } = useAuth();
  const { savedIngredients } = user || {};
  const navigate = useNavigate();

  if (isLoading) return <Loading />;

  if (!savedIngredients || savedIngredients.length === 0) {
    return (
      <Layout header>
        <ShoppingHeader empty={true} />

        <EmptyCard
          title="Votre panier est vide"
          description="Ajoutez des ingrédients depuis les recettes pour les retrouver ici."
          icon={<ShoppingBasket />}
          buttonText="Voir les recettes"
          onButtonClick={() => navigate("/")}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <ShoppingHeader />
      <ShoppingContent />
    </Layout>
  );
};
