import { EmptyCard } from "@/components/recipe-card/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { ShoppingHeader } from "@/components/shopping/ShoppingHeader";
import { ShoppingIngredientsContent } from "@/components/shopping/ShoppingIngredientsContent";
import { ShoppingProductsContent } from "@/components/shopping/ShoppingProductsContent";
import { ShoppingSearchBar } from "@/components/shopping/ShoppingSearchBar";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ShoppingPage = () => {
  const { user, isLoading } = useAuth();
  const { savedIngredients, savedProducts } = user || {};
  const navigate = useNavigate();

  if (isLoading) return <Loading />;

  if (
    (!savedIngredients || savedIngredients.length === 0) &&
    (!savedProducts || savedProducts.length === 0)
  ) {
    return (
      <Layout>
        <ShoppingHeader empty={true} />
        <ShoppingSearchBar />

        <EmptyCard
          title="Votre panier est vide"
          description="Ajoutez des produits ou des ingrédients à partir de recettes pour les retrouver ici."
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
      <ShoppingSearchBar />
      <ShoppingProductsContent />
      {savedIngredients && savedIngredients.length > 0 && (
        <ShoppingIngredientsContent />
      )}
    </Layout>
  );
};
