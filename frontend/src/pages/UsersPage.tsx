import { Layout } from "@/components/shared/Layout";
import { UsersContent } from "@/components/user/UsersContent";
import { UsersHeader } from "@/components/user/UsersHeader";

export const UsersPage = () => {
  return (
    <Layout>
      <UsersHeader />
      <UsersContent />
    </Layout>
  );
};
