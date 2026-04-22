import { UsersTable } from "@/components/admin/UsersTable";
import { DeleteUserDialog } from "@/components/dialog/DeleteUserDialog";
import { EmptyCard } from "@/components/shared/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { Empty } from "@/components/ui/empty";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";
import { useDeleteUsers } from "@/hooks/users/useDeleteUsers";
import { useGetAllUsers } from "@/hooks/users/useGetAllUsers";
import api from "@/lib/axiosInstance";
import { useState } from "react";
import { toast } from "sonner";

export const AdminUsersPage = () => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    ids: string[];
  }>({ open: false, ids: [] });
  const { users, totalUsers, isLoading } = useGetAllUsers();
  const { deleteUser } = useDeleteUser();
  const { deleteUsers } = useDeleteUsers();
  const handleDeleteUser = async (id: string) => {
    deleteUser(id)
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleDeleteMany = async (ids: string[]) => {
    deleteUsers(ids)
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error.message));
  };

  const sendResetMail = async (id: string) => {
    try {
      const response = await api.post(`/admins/users/${id}/reset-password`);
      const resetLink = response.data.data.resetLink;
      await navigator.clipboard.writeText(resetLink);
      toast.success("Lien copié dans le presse-papiers !");
    } catch {
      toast.error("Erreur lors de la génération du lien");
    }
  };

  const confirmDelete = () => {
    if (deleteDialog.ids.length === 1) {
      handleDeleteUser(deleteDialog.ids[0]);
    } else {
      handleDeleteMany(deleteDialog.ids);
    }
  };

  if (isLoading) return <Loading />;

  if (!users) return <Empty title="Impossible de récupérer les chefs" />;

  if (users.length === 0) {
    return (
      <Layout title={`${totalUsers} temps de cuissons`}>
        <EmptyCard title="Aucun temps de cuisson disponible" />
      </Layout>
    );
  }

  return (
    <Layout title={`${totalUsers} chefs`}>
      <UsersTable
        users={users}
        onDelete={(id) => setDeleteDialog({ open: true, ids: [id] })}
        onDeleteMany={(ids) => setDeleteDialog({ open: true, ids })}
        onResetPassword={sendResetMail}
      />

      <DeleteUserDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        onDelete={confirmDelete}
        count={deleteDialog.ids.length}
      />
    </Layout>
  );
};
