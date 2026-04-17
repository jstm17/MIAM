import { UsersTable } from "@/components/admin/UsersTable";
import { Layout } from "@/components/shared/Layout";
import { Empty } from "@/components/ui/empty";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";
import { useGetAllUsers } from "@/hooks/users/useGetAllUsers";
import { toast } from "sonner";

export const AdminUsersPage = () => {
  const { users } = useGetAllUsers();
  const { deleteUser } = useDeleteUser();
  const handleDeleteUser = async (id: string) => {
    deleteUser(id)
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const sendResetMail = async () => {
    // await api.post(`/admin/users/${id}/reset-password`);
    // toast.success("Mail envoyé !");
  };

  if (!users) return <Empty title="Impossible de récupérer les chefs" />;

  return (
    <Layout>
      <UsersTable
        users={users}
        onDelete={handleDeleteUser}
        onResetPassword={sendResetMail}
      />
    </Layout>
  );
};
