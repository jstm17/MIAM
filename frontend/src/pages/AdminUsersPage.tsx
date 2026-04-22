import { UsersTable } from "@/components/admin/UsersTable";
import { DeleteUserDialog } from "@/components/dialog/DeleteUserDialog";
import { EmptyCard } from "@/components/shared/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { Empty } from "@/components/ui/empty";
import { useResetPasswordAdmin } from "@/hooks/admins/useResetPasswordAdmin";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";
import { useDeleteUsers } from "@/hooks/users/useDeleteUsers";
import { useGetAllUsers } from "@/hooks/users/useGetAllUsers";
import { useState } from "react";
import { toast } from "sonner";

export const AdminUsersPage = () => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    ids: string[];
  }>({ open: false, ids: [] });
  const [resetLinks, setResetLinks] = useState<Record<string, string>>({});
  const [resetLoadingId, setResetLoadingId] = useState<string | null>(null);
  const { users, totalUsers, isLoading } = useGetAllUsers();
  const { deleteUser } = useDeleteUser();
  const { deleteUsers } = useDeleteUsers();
  const { resetPassword } = useResetPasswordAdmin();

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

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback pour HTTP
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      setResetLoadingId(id);

      const link = await resetPassword(id);

      setResetLinks((prev) => ({ ...prev, [id]: link }));

      copyToClipboard(link).catch(() => {});

      toast.success("Lien généré !");
    } catch {
      toast.error("Erreur lors de la génération du lien");
    } finally {
      setResetLoadingId(null);
    }
  };

  const copyLink = async (id: string) => {
    try {
      await copyToClipboard(resetLinks[id]);
      toast.success("Lien copié !");
    } catch {
      toast.error("Impossible de copier");
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
        resetLinks={resetLinks}
        resetLoadingId={resetLoadingId}
        onCopyLink={copyLink}
        onDelete={(id) => setDeleteDialog({ open: true, ids: [id] })}
        onDeleteMany={(ids) => setDeleteDialog({ open: true, ids })}
        onResetPassword={handleResetPassword}
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
