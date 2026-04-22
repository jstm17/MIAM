import { CategoriesTable } from "@/components/admin/CategoriesTable";
import { DeleteCategoryDialog } from "@/components/dialog/DeleteCategoryDialog";
import { EmptyCard } from "@/components/shared/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { Empty } from "@/components/ui/empty";
import { useDeleteCategories } from "@/hooks/categories/useDeleteCategories";
import { useDeleteCategory } from "@/hooks/categories/useDeleteCategory";
import { useGetAllCategories } from "@/hooks/categories/useGetAllCategories";
import { useResetCategoriesUrl } from "@/hooks/categories/useResetCategoriesUrl";
import { useResetCategoryUrl } from "@/hooks/categories/useResetCategoryUrl";
import { useUpdateCategoryUrl } from "@/hooks/categories/useUpdateCategoryUrl";
import { useState } from "react";
import { toast } from "sonner";

export const AdminCategoriesPage = () => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    ids: string[];
  }>({ open: false, ids: [] });
  const { categories, totalCategories, isLoading } = useGetAllCategories();
  const { deleteCategory } = useDeleteCategory();
  const { resetUrl } = useResetCategoryUrl();
  const { deleteCategories } = useDeleteCategories();
  const { resetUrlMany } = useResetCategoriesUrl();
  const { updateUrl } = useUpdateCategoryUrl();

  const handleDeleteMany = async (ids: string[]) => {
    deleteCategories(ids)
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error.message));
  };

  const handleResetUrlMany = async (ids: string[]) => {
    resetUrlMany(ids)
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error.message));
  };

  const handleDeleteCategory = async (id: string) => {
    deleteCategory(id)
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

  const handleUpdateUrl = async (id: string, url: string) => {
    updateUrl({ id, url })
      .then(() => {
        toast.success("URL mise à jour avec succès");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const confirmDelete = () => {
    if (deleteDialog.ids.length === 1) {
      handleDeleteCategory(deleteDialog.ids[0]);
    } else {
      handleDeleteMany(deleteDialog.ids);
    }
  };
  if (isLoading) return <Loading />;

  if (!categories)
    return <Empty title="Impossible de récupérer les catégories" />;

  if (categories.length === 0) {
    return (
      <Layout title={`${totalCategories} temps de cuissons`}>
        <EmptyCard title="Aucun temps de cuisson disponible" />
      </Layout>
    );
  }

  return (
    <Layout title={`${totalCategories} catégories`}>
      <CategoriesTable
        categories={categories}
        onDelete={(id) => setDeleteDialog({ open: true, ids: [id] })}
        onResetUrl={handleResetUrl}
        onDeleteMany={(ids) => setDeleteDialog({ open: true, ids })}
        onResetUrlMany={handleResetUrlMany}
        onUpdateUrl={handleUpdateUrl}
      />
      <DeleteCategoryDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        onDelete={confirmDelete}
        count={deleteDialog.ids.length}
      />
    </Layout>
  );
};
