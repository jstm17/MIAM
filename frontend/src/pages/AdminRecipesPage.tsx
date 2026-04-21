import { RecipesTable } from "@/components/admin/RecipesTable";
import { DeleteRecipeAdminDialog } from "@/components/dialog/DeleteRecipeAdminDialog";
import { EmptyCard } from "@/components/shared/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { Empty } from "@/components/ui/empty";
import { useDeleteRecipe } from "@/hooks/recipes/useDeleteRecipe";
import { useDeleteRecipes } from "@/hooks/recipes/useDeleteRecipes";
import { useGetAllRecipes } from "@/hooks/recipes/useGetAllRecipes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AdminRecipesPage = () => {
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    ids: string[];
  }>({ open: false, ids: [] });
  const { recipes, totalRecipes, isLoading } = useGetAllRecipes();
  const { deleteRecipe } = useDeleteRecipe();
  const { deleteRecipes } = useDeleteRecipes();
  const handleDeleteRecipe = async (id: string) => {
    deleteRecipe(id)
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleDeleteMany = async (ids: string[]) => {
    deleteRecipes(ids)
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error.message));
  };

  const handleEditRecipe = async (slug: string) => {
    navigate(`/recipe-edit/${slug}`);
  };

  const confirmDelete = () => {
    if (deleteDialog.ids.length === 1) {
      handleDeleteRecipe(deleteDialog.ids[0]);
    } else {
      handleDeleteMany(deleteDialog.ids);
    }
  };

  if (isLoading) return <Loading />;

  if (!recipes) return <Empty title="Impossible de récupérer les recette" />;

  if (recipes.length === 0) {
    return (
      <Layout title={`${totalRecipes} temps de cuissons`}>
        <EmptyCard title="Aucun temps de cuisson disponible" />
      </Layout>
    );
  }

  return (
    <Layout title={`${totalRecipes} recettes`}>
      <RecipesTable
        recipes={recipes}
        onDelete={(id) => setDeleteDialog({ open: true, ids: [id] })}
        onDeleteMany={(ids) => setDeleteDialog({ open: true, ids })}
        onEdit={handleEditRecipe}
      />

      <DeleteRecipeAdminDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        onDelete={confirmDelete}
        count={deleteDialog.ids.length}
      />
    </Layout>
  );
};
