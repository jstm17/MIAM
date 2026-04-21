import { IngredientsTable } from "@/components/admin/IngredientsTable";
import { DeleteIngredientDialog } from "@/components/dialog/DeleteIngredientDialog";
import { EmptyCard } from "@/components/shared/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { Empty } from "@/components/ui/empty";
import { useDeleteIngredient } from "@/hooks/ingredients/useDeleteIngredient";
import { useDeleteIngredients } from "@/hooks/ingredients/useDeleteIngredients";
import { useGetAllIngredients } from "@/hooks/ingredients/useGetAllIngredients";
import { useResetIngredientsUrl } from "@/hooks/ingredients/useResetIngredientsUrl";
import { useResetIngredientUrl } from "@/hooks/ingredients/useResetIngredientUrl";
import { useState } from "react";
import { toast } from "sonner";

export const AdminIngredientsPage = () => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    ids: string[];
  }>({ open: false, ids: [] });
  const { ingredients, totalIngredients, isLoading } = useGetAllIngredients();
  const { deleteIngredient } = useDeleteIngredient();
  const { resetUrl } = useResetIngredientUrl();
  const { deleteIngredients } = useDeleteIngredients();
  const { resetUrlMany } = useResetIngredientsUrl();

  const handleDeleteMany = async (ids: string[]) => {
    deleteIngredients(ids)
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error.message));
  };

  const handleResetUrlMany = async (ids: string[]) => {
    resetUrlMany(ids)
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error.message));
  };

  const handleDeleteIngredient = async (id: string) => {
    deleteIngredient(id)
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleResetUrl = async (id: string) => {
    resetUrl(id)
      .then((data) => {
        toast.success(data.message || "Image refétchée avec succès");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const confirmDelete = () => {
    if (deleteDialog.ids.length === 1) {
      handleDeleteIngredient(deleteDialog.ids[0]);
    } else {
      handleDeleteMany(deleteDialog.ids);
    }
  };
  if (isLoading) return <Loading />;

  if (!ingredients)
    return <Empty title="Impossible de récupérer les ingrédients" />;

  if (ingredients.length === 0) {
    return (
      <Layout title={`${totalIngredients} temps de cuissons`}>
        <EmptyCard title="Aucun temps de cuisson disponible" />
      </Layout>
    );
  }

  return (
    <Layout title={`${totalIngredients} ingrédients`}>
      <IngredientsTable
        ingredients={ingredients}
        onDelete={(id) => setDeleteDialog({ open: true, ids: [id] })}
        onResetUrl={handleResetUrl}
        onDeleteMany={(ids) => setDeleteDialog({ open: true, ids })}
        onResetUrlMany={handleResetUrlMany}
      />
      <DeleteIngredientDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        onDelete={confirmDelete}
        count={deleteDialog.ids.length}
      />
    </Layout>
  );
};
