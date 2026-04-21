import { CookingTimesTable } from "@/components/admin/CookingTimesTable";
import { DeleteCookingTimeAdminDialog } from "@/components/dialog/DeleteCookingTimeAdminDialog";
import { EmptyCard } from "@/components/shared/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { Empty } from "@/components/ui/empty";
import { useDeleteCookingTime } from "@/hooks/cooking-times/useDeleteCookingTime";
import { useDeleteCookingTimes } from "@/hooks/cooking-times/useDeleteCookingTimes";
import { useGetAllCookingTimes } from "@/hooks/cooking-times/useGetAllCookingTimes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AdminCookingTimesPage = () => {
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    ids: string[];
  }>({ open: false, ids: [] });
  const { cookingTimes, totalCookingTimes, isLoading } =
    useGetAllCookingTimes();
  const { deleteCookingTime } = useDeleteCookingTime();
  const { deleteCookingTimes } = useDeleteCookingTimes();

  const handleDeleteCookingTime = async (id: string) => {
    deleteCookingTime(id)
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleDeleteMany = async (ids: string[]) => {
    deleteCookingTimes(ids)
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error.message));
  };

  const handleEditCookingTime = async (slug: string) => {
    navigate(`/cooking-time-edit/${slug}`);
  };

  const confirmDelete = () => {
    if (deleteDialog.ids.length === 1) {
      handleDeleteCookingTime(deleteDialog.ids[0]);
    } else {
      handleDeleteMany(deleteDialog.ids);
    }
  };

  if (isLoading) return <Loading />;

  if (!cookingTimes)
    return <Empty title="Impossible de récupérer les temps de cuisson" />;

  if (cookingTimes.length === 0) {
    return (
      <Layout title={`${totalCookingTimes} temps de cuissons`}>
        <EmptyCard title="Aucun temps de cuisson disponible" />
      </Layout>
    );
  }

  return (
    <Layout title={`${totalCookingTimes} temps de cuissons`}>
      <CookingTimesTable
        cookingTimes={cookingTimes}
        onDelete={(id) => setDeleteDialog({ open: true, ids: [id] })}
        onDeleteMany={(ids) => setDeleteDialog({ open: true, ids })}
        onEdit={handleEditCookingTime}
      />

      <DeleteCookingTimeAdminDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        onDelete={confirmDelete}
        count={deleteDialog.ids.length}
      />
    </Layout>
  );
};
