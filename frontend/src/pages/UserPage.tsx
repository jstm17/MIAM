import { EmptyCard } from "@/components/recipe-card/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { UserContent } from "@/components/user/UserContent";
import { UserHeader } from "@/components/user/UserHeader";
import { useGetUserBySlug } from "@/hooks/users/useGetUserBySlug";
import { useNavigate, useParams } from "react-router-dom";

export const UserPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isLoading } = useGetUserBySlug(slug!);
  const navigate = useNavigate();

  if (isLoading) return <Loading />;

  if (!user) {
    return (
      <Layout header>
        <EmptyCard
          title="Utilisateur non trouvé"
          description="Cet utilisateur n'existe pas."
          buttonText="Retour"
          onButtonClick={() => navigate(-1)}
        />
      </Layout>
    );
  }
  return (
    <Layout>
      <UserHeader user={user} />
      <UserContent user={user} />
    </Layout>
  );
};
